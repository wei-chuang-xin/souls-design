'use server'

import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getUserFavorites(): Promise<string[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const { data } = await supabaseAdmin
    .from('favorites')
    .select('soul_slug')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return data?.map((r) => r.soul_slug) ?? []
}

export async function getUserDownloads(): Promise<{ soul_slug: string; downloaded_at: string }[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const { data } = await supabaseAdmin
    .from('downloads')
    .select('soul_slug, downloaded_at')
    .eq('user_id', session.user.id)
    .order('downloaded_at', { ascending: false })
    .limit(50)

  return data ?? []
}

export async function toggleFavorite(soulSlug: string): Promise<{ favorited: boolean }> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  const userId = session.user.id

  const { data: existing } = await supabaseAdmin
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('soul_slug', soulSlug)
    .single()

  if (existing) {
    await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('soul_slug', soulSlug)
    revalidatePath('/[locale]/profile', 'page')
    return { favorited: false }
  } else {
    await supabaseAdmin
      .from('favorites')
      .insert({ user_id: userId, soul_slug: soulSlug })
    revalidatePath('/[locale]/profile', 'page')
    return { favorited: true }
  }
}

export async function recordDownload(soulSlug: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) return

  await supabaseAdmin
    .from('downloads')
    .insert({ user_id: session.user.id, soul_slug: soulSlug })
}
