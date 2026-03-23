import { SoulSummary, SoulDetail, SoulType } from '@/types/soul'
import soulsData from '@/data/souls.json'
import fs from 'fs'
import path from 'path'

export function getAllSouls(): SoulSummary[] {
  return soulsData as SoulSummary[]
}

export function getSoulBySlug(slug: string): SoulDetail | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'souls', `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw).item as SoulDetail
  } catch {
    return null
  }
}

export function getAllSlugs(): string[] {
  return (soulsData as SoulSummary[]).map((s) => s.slug)
}

export function getAllTypes(): SoulType[] {
  return ['soul', 'skill', 'prompt', 'team']
}

export function isSoulType(value: string): value is SoulType {
  return getAllTypes().includes(value as SoulType)
}

export function getSoulsByType(type: SoulType): SoulSummary[] {
  return getAllSouls().filter((soul) => soul.type === type)
}

export function formatPriceLabel(amountCents: number, currency = 'usd'): string {
  if (!amountCents) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100)
}
