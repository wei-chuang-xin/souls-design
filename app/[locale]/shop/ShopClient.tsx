'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SoulSummary } from '@/types/soul'
import { TYPE_COLORS, AVATAR_COLORS } from '@/lib/soul-utils'

const TYPE_VALUES = ['all', 'soul', 'skill', 'prompt', 'team']

export default function ShopClient({
  souls,
  filters,
  downloadsLabel,
  locale,
}: {
  souls: SoulSummary[]
  filters: string[]
  downloadsLabel: string
  locale: string
}) {
  const [filterIdx, setFilterIdx] = useState(0)
  const filterValue = TYPE_VALUES[filterIdx]
  const filtered = filterValue === 'all' ? souls : souls.filter((s) => s.type === filterValue)

  return (
    <>
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((label, i) => (
          <button
            key={i}
            onClick={() => setFilterIdx(i)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              filterIdx === i
                ? 'bg-white text-black border-white'
                : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((soul) => (
          <Link
            key={soul.slug}
            href={`/${locale}/shop/${soul.slug}`}
            className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/15 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[soul.type] || AVATAR_COLORS.skill} flex items-center justify-center text-white font-bold text-sm`}>
                {soul.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                  {soul.name}
                </h3>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[soul.type] || TYPE_COLORS.skill}`}>
                  {soul.type}
                </span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{soul.subtitle}</p>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <span>↓</span>
              <span>{soul.downloads.toLocaleString()} {downloadsLabel}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
