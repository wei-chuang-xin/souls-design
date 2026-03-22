import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

export type PricingModel = 'free' | 'paid' | 'bundle'

export interface UserDownloadRecord {
  soul_slug: string
  downloaded_at: string
}

export interface UserPurchaseRecord {
  soul_slug: string
  purchased_at: string
  status: string
  amount_cents: number | null
  currency: string | null
  provider: string | null
  order_id: string | null
}

async function safeQuery<T>(promise: PromiseLike<{ data: T | null; error?: { message?: string } | null }>, fallback: T): Promise<T> {
  try {
    const result = await promise
    if (result?.error) {
      console.warn('[supabase] query failed:', result.error.message)
      return fallback
    }
    return result?.data ?? fallback
  } catch (error) {
    console.warn('[supabase] query threw:', error)
    return fallback
  }
}

export async function listUserFavorites(userId: string): Promise<string[]> {
  const data = await safeQuery(
    supabaseAdmin
      .from('favorites')
      .select('soul_slug')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    [] as { soul_slug: string }[]
  )

  return data.map((row) => row.soul_slug)
}

export async function listUserDownloads(userId: string, limit = 50): Promise<UserDownloadRecord[]> {
  return safeQuery(
    supabaseAdmin
      .from('downloads')
      .select('soul_slug, downloaded_at')
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false })
      .limit(limit),
    [] as UserDownloadRecord[]
  )
}

export async function listUserPurchases(userId: string, limit = 100): Promise<UserPurchaseRecord[]> {
  return safeQuery(
    supabaseAdmin
      .from('purchases')
      .select('soul_slug, purchased_at, status, amount_cents, currency, provider, order_id')
      .eq('user_id', userId)
      .in('status', ['paid', 'completed', 'active'])
      .order('purchased_at', { ascending: false })
      .limit(limit),
    [] as UserPurchaseRecord[]
  )
}

export async function hasUserPurchased(userId: string, soulSlug: string): Promise<boolean> {
  const data = await safeQuery(
    supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('soul_slug', soulSlug)
      .in('status', ['paid', 'completed', 'active'])
      .limit(1),
    [] as { id: string }[]
  )

  return data.length > 0
}

export async function addFavorite(userId: string, soulSlug: string): Promise<void> {
  await safeQuery(
    supabaseAdmin.from('favorites').insert({ user_id: userId, soul_slug: soulSlug }),
    null
  )
}

export async function removeFavorite(userId: string, soulSlug: string): Promise<void> {
  await safeQuery(
    supabaseAdmin.from('favorites').delete().eq('user_id', userId).eq('soul_slug', soulSlug),
    null
  )
}

export async function insertDownload(userId: string, soulSlug: string): Promise<void> {
  await safeQuery(
    supabaseAdmin.from('downloads').insert({ user_id: userId, soul_slug: soulSlug }),
    null
  )
}
