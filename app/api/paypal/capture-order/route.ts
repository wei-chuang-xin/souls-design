import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getSoulBySlug } from '@/lib/souls'

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
  // 1. 必须登录
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'signin_required' }, { status: 401 })
  }

  const { orderID, slug } = await request.json()
  if (!orderID || !slug) {
    return NextResponse.json({ ok: false, error: 'missing_params' }, { status: 400 })
  }

  // 2. Capture PayPal 订单
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
    console.error('[paypal] capture failed:', err)
    return NextResponse.json({ ok: false, error: 'capture_failed' }, { status: 502 })
  }

  const capture = await captureRes.json()

  // 3. 严格验证 PayPal 返回状态，防止伪造
  if (capture.status !== 'COMPLETED') {
    console.error('[paypal] capture status not COMPLETED:', capture.status)
    return NextResponse.json({ ok: false, error: 'payment_not_completed' }, { status: 402 })
  }

  // 4. 提取金额信息
  const purchaseUnit = capture.purchase_units?.[0]
  const captureDetail = purchaseUnit?.payments?.captures?.[0]
  const amountValue = captureDetail?.amount?.value
  const currency = captureDetail?.amount?.currency_code
  const amountCents = amountValue ? Math.round(parseFloat(amountValue) * 100) : null

  // 5. 获取商品信息（用于记录）
  const soul = getSoulBySlug(slug)

  // 6. 写入 Supabase purchases（幂等：order_id unique 约束防重复）
  const { error: dbError } = await supabaseAdmin.from('purchases').insert({
    user_id: session.user.id,
    soul_slug: slug,
    provider: 'paypal',
    order_id: orderID,
    status: 'completed',
    amount_cents: amountCents,
    currency: currency ?? soul?.price?.currency ?? 'USD',
  })

  if (dbError) {
    // 重复购买（unique 冲突）视为成功
    if (dbError.code === '23505') {
      return NextResponse.json({ ok: true, alreadyRecorded: true })
    }
    console.error('[paypal] db insert failed:', dbError)
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
