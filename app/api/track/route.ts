import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { trackEvent, EventName } from '@/lib/track'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventName, soulSlug, locale, sessionId, referrer, properties } = body

    if (!eventName) {
      return NextResponse.json({ ok: false, error: 'missing_event_name' }, { status: 400 })
    }

    // 尝试获取登录用户（失败不影响埋点）
    let userId: string | null = null
    try {
      const session = await auth()
      userId = session?.user?.id ?? null
    } catch {}

    await trackEvent({
      eventName: eventName as EventName,
      userId,
      sessionId: sessionId ?? null,
      soulSlug: soulSlug ?? null,
      locale: locale ?? null,
      referrer: referrer ?? null,
      properties: properties ?? {},
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.warn('[api/track] error:', err)
    // 永远返回 200，埋点失败不应影响前端
    return NextResponse.json({ ok: false })
  }
}
