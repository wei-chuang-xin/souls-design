import { auth } from '@/auth'
import { getSoulBySlug } from '@/lib/souls'
import { hasUserPurchased } from '@/lib/supabase'

export type DownloadAccessState = 'free' | 'owned' | 'signin' | 'purchase_required'

export async function getDownloadAccessState(soulSlug: string): Promise<DownloadAccessState> {
  const soul = getSoulBySlug(soulSlug)
  if (!soul) return 'purchase_required'

  const pricingModel = soul.price?.model ?? 'free'
  if (pricingModel === 'free') return 'free'

  const session = await auth()
  
  // 调试日志
  console.log('[DEBUG] getDownloadAccessState:', {
    soulSlug,
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  })

  if (!session?.user?.id) {
    console.log('[DEBUG] No user.id, returning signin')
    return 'signin'
  }

  const purchased = await hasUserPurchased(session.user.id, soulSlug)
  console.log('[DEBUG] Purchase check:', { userId: session.user.id, soulSlug, purchased })
  
  return purchased ? 'owned' : 'purchase_required'
}
