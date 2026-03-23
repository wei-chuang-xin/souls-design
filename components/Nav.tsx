'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe } from 'lucide-react'

function LangDropdown({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{locale === 'zh' ? '中文' : 'EN'}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-24 rounded-lg border border-white/10 bg-zinc-900 shadow-xl z-50 overflow-hidden">
          <Link
            href="/en"
            onClick={() => setOpen(false)}
            className={`block px-3 py-2 text-xs transition-colors ${
              locale === 'en' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            English
          </Link>
          <Link
            href="/zh"
            onClick={() => setOpen(false)}
            className={`block px-3 py-2 text-xs transition-colors ${
              locale === 'zh' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            中文
          </Link>
        </div>
      )}
    </div>
  )
}

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
          <LangDropdown locale={locale} />
          {authSlot && <div className="ml-1">{authSlot}</div>}
        </div>

        {/* Mobile: auth + lang + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {authSlot && <div>{authSlot}</div>}
          <LangDropdown locale={locale} />
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
