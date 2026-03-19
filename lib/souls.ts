import { SoulSummary, SoulDetail } from '@/types/soul'
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
