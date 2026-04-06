import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getSoulBySlug } from '@/lib/souls'
import { trackEvent } from '@/lib/track'

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !secret) throw new Error('PayPal credentials not configured')

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token as string
}

export async function POST(request: Request) {
  const startTime = Date.now()
  
  // 1. 必须登录
  const session = await auth()
  if (!session?.user?.id) {
    console.log('[PayPal] Capture failed: not authenticated')
    return NextResponse.json({ ok: false, error: 'signin_required' }, { status: 401 })
  }

  const { orderID, slug } = await request.json()
  if (!orderID || !slug) {
    console.log('[PayPal] Capture failed: missing params', { orderID, slug })
    return NextResponse.json({ ok: false, error: 'missing_params' }, { status: 400 })
  }

  console.log('[PayPal] Capture start:', {
    userId: session.user.id,
    orderID,
    slug,
    timestamp: new Date().toISOString(),
  })

  // 2. 获取商品信息（用于验证金额）
  const soul = getSoulBySlug(slug)
  if (!soul) {
    console.log('[PayPal] Capture failed: product not found', { slug })
    return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 })
  }

  const expectedAmountCents = soul.price?.amount_cents ?? 0
  const expectedCurrency = soul.price?.currency ?? 'USD'

  // 3. Capture PayPal 订单
  const accessToken = await getPayPalAccessToken()
  const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!captureRes.ok) {
    const err = await captureRes.text()
    console.error('[PayPal] Capture API failed:', {
      status: captureRes.status,
      error: err,
      orderID,
      userId: session.user.id,
    })
    await trackEvent({ 
      eventName: 'payment_failed', 
      userId: session.user.id, 
      soulSlug: slug, 
      properties: { reason: 'capture_api_failed', status: captureRes.status } 
    })
    return NextResponse.json({ ok: false, error: 'capture_failed' }, { status: 502 })
  }

  const capture = await captureRes.json()

  // 4. 严格验证 PayPal 返回状态
  if (capture.status !== 'COMPLETED') {
    console.error('[PayPal] Capture status not COMPLETED:', {
      status: capture.status,
      orderID,
      userId: session.user.id,
    })
    await trackEvent({ 
      eventName: 'payment_failed', 
      userId: session.user.id, 
      soulSlug: slug, 
      properties: { reason: 'not_completed', status: capture.status } 
    })
    return NextResponse.json({ ok: false, error: 'payment_not_completed' }, { status: 402 })
  }

  // 5. 提取并验证金额
  const purchaseUnit = capture.purchase_units?.[0]
  const captureDetail = purchaseUnit?.payments?.captures?.[0]
  const amountValue = captureDetail?.amount?.value
  const currency = captureDetail?.amount?.currency_code
  const amountCents = amountValue ? Math.round(parseFloat(amountValue) * 100) : null

  // 金额验证
  if (!amountCents || amountCents !== expectedAmountCents) {
    console.error('[PayPal] Amount mismatch:', {
      expected: expectedAmountCents,
      actual: amountCents,
      orderID,
      userId: session.user.id,
      slug,
    })
    await trackEvent({ 
      eventName: 'payment_failed', 
      userId: session.user.id, 
      soulSlug: slug, 
      properties: { 
        reason: 'amount_mismatch', 
        expected: expectedAmountCents, 
        actual: amountCents 
      } 
    })
    return NextResponse.json({ ok: false, error: 'amount_mismatch' }, { status: 400 })
  }

  // 币种验证
  if (currency?.toUpperCase() !== expectedCurrency.toUpperCase()) {
    console.error('[PayPal] Currency mismatch:', {
      expected: expectedCurrency,
      actual: currency,
      orderID,
      userId: session.user.id,
      slug,
    })
    await trackEvent({ 
      eventName: 'payment_failed', 
      userId: session.user.id, 
      soulSlug: slug, 
      properties: { 
        reason: 'currency_mismatch', 
        expected: expectedCurrency, 
        actual: currency 
      } 
    })
    return NextResponse.json({ ok: false, error: 'currency_mismatch' }, { status: 400 })
  }

  // 6. 写入 Supabase purchases（幂等：order_id unique 约束防重复）
  const { error: dbError } = await supabaseAdmin.from('purchases').insert({
    user_id: session.user.id,
    soul_slug: slug,
    provider: 'paypal',
    order_id: orderID,
    status: 'completed',
    amount_cents: amountCents,
    currency: currency ?? expectedCurrency,
  })

  if (dbError) {
    // 重复购买（unique 冲突）视为成功
    if (dbError.code === '23505') {
      console.log('[PayPal] Duplicate purchase detected (idempotent):', {
        orderID,
        userId: session.user.id,
        slug,
      })
      return NextResponse.json({ ok: true, alreadyRecorded: true })
    }
    console.error('[PayPal] Database insert failed:', {
      error: dbError,
      orderID,
      userId: session.user.id,
      slug,
    })
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 })
  }

  const duration = Date.now() - startTime
  console.log('[PayPal] Capture success:', {
    orderID,
    userId: session.user.id,
    slug,
    amountCents,
    currency,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  })

  await trackEvent({ 
    eventName: 'payment_success', 
    userId: session.user.id, 
    soulSlug: slug, 
    properties: { 
      amount_cents: amountCents, 
      currency, 
      provider: 'paypal', 
      order_id: orderID,
      duration_ms: duration,
    } 
  })
  
  return NextResponse.json({ ok: true })
}
