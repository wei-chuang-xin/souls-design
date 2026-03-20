'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface Soul {
  slug: string
  name: string
  type: 'soul' | 'skill' | 'prompt' | 'team'
  subtitle: string
  downloads: number
}

export interface ShopClientProps {
  souls: Soul[]
  filters: string[]
  downloadsLabel: string
  locale: string
  onCardClick?: (locale: string, slug: string) => void
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const TYPE_EMOJI: Record<Soul['type'], string> = {
  soul: '🔮',
  skill: '⚡',
  prompt: '🪄',
  team: '👥',
}

const TYPE_LABEL: Record<Soul['type'], string> = {
  soul: 'Soul',
  skill: 'Skill',
  prompt: 'Prompt',
  team: 'Team',
}

/** Badge pill colours (bg + text, no Tailwind arbitrary values — inline style via CSS vars) */
const TYPE_BADGE: Record<Soul['type'], { bg: string; text: string; glow: string }> = {
  soul: {
    bg: 'rgba(139,92,246,0.15)',
    text: '#c4b5fd',
    glow: 'rgba(139,92,246,0.35)',
  },
  skill: {
    bg: 'rgba(59,130,246,0.15)',
    text: '#93c5fd',
    glow: 'rgba(59,130,246,0.35)',
  },
  prompt: {
    bg: 'rgba(16,185,129,0.15)',
    text: '#6ee7b7',
    glow: 'rgba(16,185,129,0.35)',
  },
  team: {
    bg: 'rgba(249,115,22,0.15)',
    text: '#fdba74',
    glow: 'rgba(249,115,22,0.35)',
  },
}

const TYPE_ICON_GLOW: Record<Soul['type'], string> = {
  soul: 'rgba(139,92,246,0.22)',
  skill: 'rgba(59,130,246,0.22)',
  prompt: 'rgba(16,185,129,0.22)',
  team: 'rgba(249,115,22,0.22)',
}

const TYPE_HOVER_BORDER: Record<Soul['type'], string> = {
  soul: 'rgba(139,92,246,0.45)',
  skill: 'rgba(59,130,246,0.45)',
  prompt: 'rgba(16,185,129,0.45)',
  team: 'rgba(249,115,22,0.45)',
}

const TYPE_HOVER_SHADOW: Record<Soul['type'], string> = {
  soul: '0 0 0 1px rgba(139,92,246,0.45), 0 8px 32px rgba(139,92,246,0.12)',
  skill: '0 0 0 1px rgba(59,130,246,0.45), 0 8px 32px rgba(59,130,246,0.12)',
  prompt: '0 0 0 1px rgba(16,185,129,0.45), 0 8px 32px rgba(16,185,129,0.12)',
  team: '0 0 0 1px rgba(249,115,22,0.45), 0 8px 32px rgba(249,115,22,0.12)',
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Inline SVG arrow-down icon — no external library */
function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 1.5v9M2.5 7l3.5 3.5L9.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Single card */
function ShopCard({
  soul,
  downloadsLabel,
  locale,
  onCardClick,
}: {
  soul: Soul
  downloadsLabel: string
  locale: string
  onCardClick?: (locale: string, slug: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const badge = TYPE_BADGE[soul.type]
  const iconGlow = TYPE_ICON_GLOW[soul.type]

  return (
    <Link
      href={`/${locale}/shop/${soul.slug}`}
      aria-label={`${soul.name} — ${TYPE_LABEL[soul.type]}`}
      
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative flex cursor-pointer flex-col gap-4 rounded-xl p-5 outline-none transition-all duration-200"
      style={{
        background: hovered ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? TYPE_HOVER_BORDER[soul.type] : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? TYPE_HOVER_SHADOW[soul.type] : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-xl text-4xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          boxShadow: `0 0 20px 2px ${iconGlow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          border: '1px solid rgba(255,255,255,0.07)',
        }}
        aria-hidden="true"
      >
        {TYPE_EMOJI[soul.type]}
      </div>

      {/* Name + Badge row */}
      <div className="flex min-w-0 items-center gap-2">
        <h3
          className="flex-1 truncate text-sm font-semibold leading-snug text-white"
          title={soul.name}
        >
          {soul.name}
        </h3>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: badge.bg,
            color: badge.text,
          }}
        >
          {TYPE_LABEL[soul.type]}
        </span>
      </div>

      {/* Subtitle */}
      <p
        className="line-clamp-2 flex-1 text-xs leading-relaxed"
        style={{ color: 'rgba(161,161,170,1)' }}
      >
        {soul.subtitle}
      </p>

      {/* Downloads */}
      <div
        className="flex items-center gap-1.5 text-xs font-medium"
        style={{ color: 'rgba(113,113,122,1)' }}
      >
        <ArrowDownIcon />
        <span>{formatDownloads(soul.downloads)}</span>
        <span>{downloadsLabel}</span>
      </div>
    </Link>
  )
}

/** Filter pill button */
function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      style={
        active
          ? {
              background: 'rgba(255,255,255,1)',
              color: '#09090b',
            }
          : {
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(161,161,170,1)',
              border: '1px solid rgba(255,255,255,0.08)',
            }
      }
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export default function ShopClient({
  souls,
  filters,
  downloadsLabel,
  locale,
  onCardClick,
}: ShopClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>(filters[0] ?? 'All')

  const filtered = useMemo(() => {
    if (activeFilter === 'All' || activeFilter === filters[0]) return souls
    return souls.filter(
      (s) => s.type.toLowerCase() === activeFilter.toLowerCase(),
    )
  }, [souls, activeFilter, filters])

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: '#09090b' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <h1
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Marketplace
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: 'rgba(113,113,122,1)' }}
          >
            Discover and deploy souls, skills, prompts &amp; teams.
          </p>
        </header>

        {/* Filter tabs */}
        <nav
          aria-label="Filter by type"
          className="mb-8 flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <FilterTab
              key={f}
              label={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            />
          ))}
        </nav>

        {/* Results count */}
        <p
          className="mb-6 text-xs"
          style={{ color: 'rgba(63,63,70,1)' }}
          aria-live="polite"
        >
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </p>

        {/* Card grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((soul) => (
              <ShopCard
                key={soul.slug}
                soul={soul}
                downloadsLabel={downloadsLabel}
                locale={locale}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center rounded-xl py-24"
            style={{
              border: '1px dashed rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-4xl" aria-hidden="true">
              🔍
            </span>
            <p
              className="mt-4 text-sm"
              style={{ color: 'rgba(113,113,122,1)' }}
            >
              No items found for this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
