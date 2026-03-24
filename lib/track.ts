/**
 * souls.design 用户行为埋点
 * 服务端调用：trackEvent()
 * 客户端调用：trackEventClient()
 */

import { supabaseAdmin } from '@/lib/supabase'

export type EventName =
  | 'page_view'
  | 'product_view'
  | 'cta_click'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed'

export interface TrackEventOptions {
  eventName: EventName
  userId?: string | null
  sessionId?: string | null
  soulSlug?: string | null
  locale?: string | null
  referrer?: string | null
  properties?: Record<string, unknown>
}

/**
 * 服务端埋点（在 API route / Server Component 中调用）
 * 失败静默，不影响主流程
 */
export async function trackEvent(opts: TrackEventOptions): Promise<void> {
  try {
    await supabaseAdmin.from('events').insert({
      event_name: opts.eventName,
      user_id:    opts.userId    ?? null,
      session_id: opts.sessionId ?? null,
      soul_slug:  opts.soulSlug  ?? null,
      locale:     opts.locale    ?? null,
      referrer:   opts.referrer  ?? null,
      properties: opts.properties ?? {},
    })
  } catch (err) {
    // 埋点失败静默，绝不影响主流程
    console.warn('[track] failed to record event:', opts.eventName, err)
  }
}
