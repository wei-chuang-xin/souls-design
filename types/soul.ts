export type SoulType = 'soul' | 'skill' | 'prompt' | 'team'

export interface SoulSummary {
  slug: string
  name: string
  type: SoulType
  downloads: number
  rating: number
  subtitle: string
  has_readme: boolean
}

export interface SoulDetail {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  category: string
  item_type: SoulType
  tags: string[]
  compatibility: string[]
  license: string
  price: { amount_cents: number; currency: string; model: string }
  stats: { downloads: number; stars: number; avg_rating: number; reviews: number }
  creator: { slug: string; display_name: string; verified: boolean }
  latest_version: { version: string; published_at: string; changelog: string }
  avatar_url: string | null
  readme_content: string | null
  file_manifest: string[]
}
