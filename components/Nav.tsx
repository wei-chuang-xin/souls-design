'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'

export default function Nav({ authSlot }: { authSlot?: React.ReactNode }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href={`/${locale}`} className="font-bold text-white tracking-tight">
          souls.design
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
          <Link href={`/${locale}/shop`} className="hover:text-white transition-colors">{t('browse')}</Link>
          <Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about')}</Link>
          <Link href={`/${locale}/setup`} className="hover:text-white transition-colors">{t('setup')}</Link>
          <div className="flex gap-2 ml-2">
            <Link href="/en" className={`text-xs px-2 py-1 rounded border transition-colors ${locale === 'en' ? 'border-white/30 text-white' : 'border-white/10 text-zinc-500 hover:text-zinc-300'}`}>EN</Link>
            <Link href="/zh" className={`text-xs px-2 py-1 rounded border transition-colors ${locale === 'zh' ? 'border-white/30 text-white' : 'border-white/10 text-zinc-500 hover:text-zinc-300'}`}>中文</Link>
          </div>
          {authSlot && <div className="ml-1">{authSlot}</div>}
        </div>

        {/* Mobile: auth + lang + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {authSlot && <div>{authSlot}</div>}
          <Link href="/en" className={`text-xs px-2 py-1 rounded border transition-colors ${locale === 'en' ? 'border-white/30 text-white' : 'border-white/10 text-zinc-500'}`}>EN</Link>
          <Link href="/zh" className={`text-xs px-2 py-1 rounded border transition-colors ${locale === 'zh' ? 'border-white/30 text-white' : 'border-white/10 text-zinc-500'}`}>中文</Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-white/5 bg-zinc-950/95 px-4 py-3 flex flex-col gap-1 text-sm">
          <Link href={`/${locale}/shop`} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">{t('browse')}</Link>
          <Link href={`/${locale}/about`} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">{t('about')}</Link>
          <Link href={`/${locale}/setup`} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">{t('setup')}</Link>
        </div>
      )}
    </nav>
  )
}
