import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { hasUserPurchased } from '@/lib/supabase'

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
  const session = await auth()
  if (!session?.user?.id) {
    console.log('[PayPal] Create order failed: not authenticated')
    return NextResponse.json({ ok: false, error: 'signin_required' }, { status: 401 })
  }

  const { slug } = await request.json()
  if (!slug || typeof slug !== 'string') {
    console.log('[PayPal] Create order failed: invalid slug', { slug })
    return NextResponse.json({ ok: false, error: 'invalid_slug' }, { status: 400 })
  }

  console.log('[PayPal] Create order start:', {
    userId: session.user.id,
    slug,
    timestamp: new Date().toISOString(),
  })

  // 检查是否已购买
  const alreadyPurchased = await hasUserPurchased(session.user.id, slug)
  if (alreadyPurchased) {
    console.log('[PayPal] Create order failed: already purchased', {
      userId: session.user.id,
      slug,
    })
    return NextResponse.json({ ok: false, error: 'already_purchased' }, { status: 409 })
  }

  // 获取商品信息
  const { getSoulBySlug } = await import('@/lib/souls')
  const soul = getSoulBySlug(slug)
  if (!soul) {
    console.log('[PayPal] Create order failed: product not found', { slug })
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }
  
  if (soul.price?.model === 'free') {
    console.log('[PayPal] Create order failed: item is free', { slug })
    return NextResponse.json({ ok: false, error: 'item_is_free' }, { status: 400 })
  }

  const amountCents = soul.price?.amount_cents ?? 0
  const currency = soul.price?.currency ?? 'USD'
  const amountStr = (amountCents / 100).toFixed(2)

  // 金额验证
  if (amountCents <= 0) {
    console.error('[PayPal] Create order failed: invalid amount', {
      slug,
      amountCents,
    })
    return NextResponse.json({ ok: false, error: 'invalid_amount' }, { status: 400 })
  }

  console.log('[PayPal] Creating order:', {
    userId: session.user.id,
    slug,
    amountCents,
    currency,
    productName: soul.name,
  })

  // 创建 PayPal 订单
  const accessToken = await getPayPalAccessToken()
  const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: slug,
          description: soul.name,
          amount: {
            currency_code: currency.toUpperCase(),
            value: amountStr,
          },
        },
      ],
    }),
  })

  if (!orderRes.ok) {
    const err = await orderRes.text()
    console.error('[PayPal] Create order API failed:', {
      status: orderRes.status,
      error: err,
      userId: session.user.id,
      slug,
    })
    return NextResponse.json({ ok: false, error: 'paypal_error' }, { status: 502 })
  }

  const order = await orderRes.json()
  
  console.log('[PayPal] Order created successfully:', {
    orderID: order.id,
    userId: session.user.id,
    slug,
    amountCents,
    currency,
  })

  return NextResponse.json({ ok: true, orderID: order.id })
}
