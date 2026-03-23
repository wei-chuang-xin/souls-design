"use client"

import { useState, useTransition, useCallback } from "react"
import { useTranslations } from "next-intl"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import ReactMarkdown from "react-markdown"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SoulDetailProps {
  name: string
  type: "soul" | "skill" | "prompt" | "team"
  subtitle: string
  description: string
  version?: string
  author: string
  downloads: number
  tags?: string[]
  readme?: string
  files?: string[]
  license: string
  backHref: string
  downloadHref: string
  slug?: string
  isFavorited?: boolean
  onToggleFavorite?: (slug: string) => Promise<{ favorited: boolean } | void>
  pricingModel?: 'free' | 'paid' | 'bundle'
  priceAmountCents?: number
  priceCurrency?: string
  downloadAccessState?: 'free' | 'owned' | 'signin' | 'purchase_required'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_EMOJI: Record<SoulDetailProps["type"], string> = {
  soul: "🔮",
  skill: "⚡",
  prompt: "🪄",
  team: "👥",
}

const TYPE_LABEL: Record<SoulDetailProps["type"], string> = {
  soul: "Soul",
  skill: "Skill",
  prompt: "Prompt",
  team: "Team",
}

const TYPE_GLOW: Record<SoulDetailProps["type"], string> = {
  soul:   "shadow-[0_0_32px_rgba(139,92,246,0.35)]  border-violet-500/25  bg-violet-950/40",
  skill:  "shadow-[0_0_32px_rgba(59,130,246,0.35)]   border-blue-500/25    bg-blue-950/40",
  prompt: "shadow-[0_0_32px_rgba(16,185,129,0.35)]   border-emerald-500/25 bg-emerald-950/40",
  team:   "shadow-[0_0_32px_rgba(249,115,22,0.35)]   border-orange-500/25  bg-orange-950/40",
}

const TYPE_BADGE: Record<SoulDetailProps["type"], string> = {
  soul:   "bg-violet-500/15  text-violet-300  border-violet-500/30",
  skill:  "bg-blue-500/15    text-blue-300    border-blue-500/30",
  prompt: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  team:   "bg-orange-500/15  text-orange-300  border-orange-500/30",
}

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#52525b] mb-3 select-none">
      {children}
    </h2>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <hr className="border-0 border-t border-[#27272a]" />
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SoulDetail({
  name,
  type,
  subtitle,
  description,
  version = "v1.0.0",
  author,
  downloads,
  tags = [],
  readme,
  files = [],
  license,
  backHref,
  downloadHref,
  slug,
  isFavorited = false,
  onToggleFavorite,
  pricingModel = 'free',
  priceAmountCents = 0,
  priceCurrency = 'usd',
  downloadAccessState = 'free',
}: SoulDetailProps) {
  const [copied, setCopied] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)
  const [favPending, startFavTransition] = useTransition()
  const [buyState, setBuyState] = useState<'idle' | 'paying' | 'capturing' | 'owned' | 'error'>('idle')
  const [accessState, setAccessState] = useState(downloadAccessState)

  const handleCreateOrder = useCallback(async () => {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)
    setBuyState('paying')
    return data.orderID as string
  }, [slug])

  const handleApprove = useCallback(async (data: { orderID: string }) => {
    setBuyState('capturing')
    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID, slug }),
    })
    const json = await res.json()
    if (!json.ok) { setBuyState('error'); return }
    setBuyState('owned')
    setAccessState('owned')
  }, [slug])

  async function handleFavorite() {
    if (!slug || !onToggleFavorite) return
    startFavTransition(async () => {
      await onToggleFavorite(slug)
      setFavorited((v) => !v)
    })
  }


  function renderCTA() {
    if (accessState === 'free' || accessState === 'owned' || buyState === 'owned') {
      return (
        <a
          href={downloadHref}
          className="inline-flex items-center gap-2 rounded-lg bg-[#fafafa] px-5 py-2.5 text-sm font-semibold text-[#09090b] transition-all duration-150 hover:bg-white hover:shadow-[0_0_20px_rgba(250,250,250,0.15)] active:scale-[0.98] select-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="m8 11 4 4 4-4" />
            <path d="M3 19h18" />
          </svg>
          {t('download_label', { type: label })}
        </a>
      )
    }
    if (accessState === 'signin') {
      return (
        <a
          href="/auth/signin"
          className="inline-flex items-center gap-2 rounded-lg bg-[#fafafa] px-5 py-2.5 text-sm font-semibold text-[#09090b] transition-all duration-150 hover:bg-white hover:shadow-[0_0_20px_rgba(250,250,250,0.15)] active:scale-[0.98] select-none"
        >
          {t('signin_to_buy')}
        </a>
      )
    }
    return (
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {buyState === 'error' && <p className="text-xs text-red-400">{t('payment_failed')}</p>}
        {buyState === 'capturing' && <p className="text-xs text-zinc-400">{t('processing_payment')}</p>}
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '', currency: priceCurrency.toUpperCase() }}>
          <PayPalButtons
            style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'buynow', height: 40, tagline: false }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={() => setBuyState('error')}
            disabled={buyState === 'capturing'}
          />
        </PayPalScriptProvider>
        <p className="text-xs text-zinc-600">{priceLabel} &middot; {t('secure_payment')}</p>
      </div>
    )
  }
  function handleCopy() {
    if (!readme) return
    navigator.clipboard.writeText(readme).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const t = useTranslations('soul_detail')
  const emoji = TYPE_EMOJI[type]
  const glow  = TYPE_GLOW[type]
  const badge = TYPE_BADGE[type]
  const label = TYPE_LABEL[type]
  const isPaid = pricingModel === 'paid' || pricingModel === 'bundle'
  const priceLabel = !isPaid ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency: priceCurrency.toUpperCase(), maximumFractionDigits: 0 }).format((priceAmountCents || 0) / 100)

  return (
    <div
      className="font-sans min-h-screen"
      style={{ backgroundColor: "#09090b", color: "#fafafa" }}
    >
      {/* ── Subtle top-edge accent line ── */}
      <div
        className="h-px w-full"
        style={{
          background:
            type === "soul"
              ? "linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%)"
              : type === "skill"
              ? "linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)"
              : type === "prompt"
              ? "linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)",
        }}
      />

      {/* ── Page container ── */}
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-8 md:px-8 md:pt-12">

        {/* ── 1. Back link ── */}
        <a
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[#71717a] transition-colors duration-150 hover:text-[#fafafa] mb-10 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 5-7 7 7 7" />
          </svg>
          {t('back')}
        </a>

        {/* ── 2. Header area ── */}
        <header className="mb-10">
          {/* Icon + text row */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
            {/* Glowing icon square */}
            <div
              className={`flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl border text-4xl select-none ${glow}`}
              role="img"
              aria-label={`${label} icon`}
            >
              {emoji}
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              {/* Type badge + version */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge}`}
                >
                  {label}
                </span>
                <span className="rounded-full border border-[#27272a] bg-[#18181b] px-2.5 py-0.5 text-xs font-mono text-[#71717a]">
                  {version}
                </span>
              </div>

              {/* Name */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-[#fafafa] text-balance leading-tight sm:text-3xl">
                  {name}
                </h1>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${isPaid ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                  {priceLabel}
                </span>
              </div>

              {/* Subtitle */}
              <p className="mt-1.5 text-sm text-[#71717a] leading-relaxed">
                {subtitle}
              </p>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#71717a]">
                {/* Author */}
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13" height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <span className="text-[#a1a1aa]">{author}</span>
                </span>

                {/* Downloads */}
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13" height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3v12" />
                    <path d="m8 11 4 4 4-4" />
                    <path d="M3 19h18" />
                  </svg>
                  <span className="text-[#a1a1aa]">{formatDownloads(downloads)} {t('downloads')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="mt-7 flex items-center gap-3 flex-wrap">
            {renderCTA()}
            {slug && onToggleFavorite && (
              <button
                onClick={handleFavorite}
                disabled={favPending}
                aria-label={favorited ? t('remove_favorite') : t('add_favorite')}
                className={[
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border transition-all duration-150 active:scale-[0.98] select-none',
                  favorited ? 'border-red-500/40 bg-red-950/30 text-red-400 hover:bg-red-950/50' : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20',
                  favPending ? 'opacity-50 cursor-not-allowed' : ''
                ].join(' ')}
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24'
                  fill={favorited ? 'currentColor' : 'none'} stroke='currentColor'
                  strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                </svg>
                {favorited ? t('saved') : t('save')}
              </button>
            )}
          </div>
        </header>

        <Divider />

        {/* ── 3. Description ── */}
        <section className="py-8" aria-labelledby="about-heading">
          <SectionHeading>
            <span id="about-heading">{t('about')}</span>
          </SectionHeading>
          <p className="text-sm leading-relaxed text-[#a1a1aa]">{description}</p>
        </section>

        {/* ── 4. Tags ── */}
        {tags.length > 0 && (
          <>
            <Divider />
            <section className="py-8" aria-labelledby="tags-heading">
              <SectionHeading>
                <span id="tags-heading">{t('tags')}</span>
              </SectionHeading>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#27272a] px-3 py-1 text-xs font-medium text-[#71717a] hover:border-[#3f3f46] hover:text-[#a1a1aa] transition-colors duration-100 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── 5. README ── */}
        {readme && (
          <>
            <Divider />
            <section className="py-8" aria-labelledby="readme-heading">
              <div className="flex items-center justify-between mb-3">
                <SectionHeading>
                  <span id="readme-heading">{t('readme')}</span>
                </SectionHeading>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={t('copy_readme')}
                  className="flex items-center gap-1.5 rounded-md border border-[#27272a] bg-[#18181b] px-2.5 py-1 text-xs text-[#71717a] hover:text-[#a1a1aa] hover:border-[#3f3f46] transition-colors duration-100 select-none"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t('copied')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {t('copy')}
                    </>
                  )}
                </button>
              </div>

              {/* Markdown render */}
              <div className="prose prose-invert prose-sm max-w-none text-[#a1a1aa] [&_h1]:text-[#fafafa] [&_h2]:text-[#e4e4e7] [&_h3]:text-[#d4d4d8] [&_strong]:text-[#e4e4e7] [&_code]:text-[#a1a1aa] [&_code]:bg-[#18181b] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_li]:text-[#a1a1aa] [&_a]:text-violet-400 [&_a:hover]:text-violet-300">
                <ReactMarkdown>{readme}</ReactMarkdown>
              </div>
            </section>
          </>
        )}

        {/* ── 6. Files ── */}
        {files.length > 0 && (
          <>
            <Divider />
            <section className="py-8" aria-labelledby="files-heading">
              <SectionHeading>
                <span id="files-heading">{t('files')}</span>
              </SectionHeading>
              <ul className="space-y-0 rounded-xl border border-[#27272a] overflow-hidden divide-y divide-[#1f1f22]">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 bg-[#0d0d0f] hover:bg-[#111113] transition-colors duration-100"
                  >
                    {/* File icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14" height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 text-[#3f3f46]"
                      aria-hidden="true"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="font-mono text-xs text-[#71717a]">{file}</span>
                    {/* Extension badge */}
                    {file.includes(".") && (
                      <span className="ml-auto rounded border border-[#27272a] px-1.5 py-0.5 font-mono text-[10px] text-[#3f3f46]">
                        .{file.split(".").pop()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* ── 7. Footer info bar ── */}
        <Divider />
        <footer className="pt-8 pb-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#52525b]">
            {/* License */}
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12" height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 12 2 2 4-4" />
                <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
                <path d="M22 19H2" />
              </svg>
              {license}
            </span>

            <span className="text-[#27272a]" aria-hidden="true">·</span>

            {/* Source */}
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-[#71717a] transition-colors duration-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12" height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              {t('source')}
            </a>

            <span className="text-[#27272a]" aria-hidden="true">·</span>

            {/* Author */}
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12" height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {t('by_author', { author })}
            </span>

            {/* Branding */}
            <span className="ml-auto text-[#3f3f46] font-mono tracking-tight select-none">
              souls.design
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}
