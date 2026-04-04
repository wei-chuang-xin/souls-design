'use server'

import { auth } from '@/auth'
import {
  addFavorite,
  hasUserPurchased,
  insertDownload,
  listUserDownloads,
  listUserFavorites,
  listUserPurchases,
} from '@/lib/supabase'
import { getSoulBySlug } from '@/lib/souls'
import { revalidatePath } from 'next/cache'

export type DownloadAccessState = 'free' | 'owned' | 'signin' | 'purchase_required'

export async function getUserFavorites(): Promise<string[]> {
  const session = await auth()
  if (!session?.user?.id) return []
  return listUserFavorites(session.user.id)
}

export async function getUserDownloads(): Promise<{ soul_slug: string; downloaded_at: string }[]> {
  const session = await auth()
  if (!session?.user?.id) return []
  return listUserDownloads(session.user.id)
}

export async function getUserPurchases(): Promise<{
  soul_slug: string
  purchased_at: string
  status: string
  amount_cents?: number | null
  currency?: string | null
  provider?: string | null
  order_id?: string | null
}[]> {
  const session = await auth()
  if (!session?.user?.id) return []
  return listUserPurchases(session.user.id)
}

export async function toggleFavorite(soulSlug: string): Promise<{ favorited: boolean }> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  const userId = session.user.id
  const favorites = await listUserFavorites(userId)
  const exists = favorites.includes(soulSlug)

  if (exists) {
    const { removeFavorite } = await import('@/lib/supabase')
    await removeFavorite(userId, soulSlug)
    revalidatePath('/[locale]/profile', 'page')
    return { favorited: false }
  }

  await addFavorite(userId, soulSlug)
  revalidatePath('/[locale]/profile', 'page')
  return { favorited: true }
}

export async function recordDownload(soulSlug: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) return
  await insertDownload(session.user.id, soulSlug)
}

export async function getDownloadAccessState(soulSlug: string): Promise<DownloadAccessState> {
  const soul = getSoulBySlug(soulSlug)
  if (!soul) return 'purchase_required'

  const pricingModel = soul.price?.model ?? 'free'
  if (pricingModel === 'free') return 'free'

  const session = await auth()
  console.log("[DEBUG] getDownloadAccessState:", { soulSlug, hasSession: !!session, hasUser: !!session?.user, userId: session?.user?.id, userEmail: session?.user?.email })
  if (!session?.user?.id) {
    console.log("[DEBUG] No user.id, returning signin")
    return 'signin'
  }

  const purchased = await hasUserPurchased(session.user.id, soulSlug)
  return purchased ? 'owned' : 'purchase_required'
}

export async function canCurrentUserDownload(soulSlug: string): Promise<boolean> {
  const state = await getDownloadAccessState(soulSlug)
  return state === 'free' || state === 'owned'
}
