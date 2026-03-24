/**
 * 客户端埋点工具
 * 在 Client Component 中使用，通过 /api/track 路由写入
 */

export type EventName =
  | 'page_view'
  | 'product_view'
  | 'cta_click'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed'

export interface TrackEventOptions {
  eventName: EventName
  soulSlug?: string | null
  locale?: string | null
  properties?: Record<string, unknown>
}

/**
 * 获取或创建浏览器 session_id（存 sessionStorage，关闭标签即失效）
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('_sd_sid')
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem('_sd_sid', sid)
  }
  return sid
}

/**
 * 客户端埋点，发送到 /api/track
 * 失败静默，不影响主流程
 */
export function trackEventClient(opts: TrackEventOptions): void {
  try {
    const payload = {
      ...opts,
      sessionId: getSessionId(),
      referrer: document.referrer || null,
    }
    // 用 sendBeacon 优先（页面关闭时也能发出），降级 fetch
    const body = JSON.stringify(payload)
    const url = '/api/track'
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }))
    } else {
      fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch (err) {
    console.warn('[track-client] failed:', err)
  }
}
