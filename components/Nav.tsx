'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-14">
        <Link href={`/${locale}`} className="font-bold text-white tracking-tight">
          souls.design
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href={`/${locale}/shop`} className="hover:text-white transition-colors">{t('browse')}</Link>
          <Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about')}</Link>
          <Link href={`/${locale}/setup`} className="hover:text-white transition-colors">{t('setup')}</Link>
          <div className="flex gap-2 ml-2">
            <Link href="/en" className={`text-xs px-2 py-1 rounded border transition-colors ${locale === 'en' ? 'border-white/30 text-white' : 'border-white/10 text-zinc-500 hover:text-zinc-300'}`}>EN</Link>
            <Link href="/zh" className={`text-xs px-2 py-1 rounded border transition-colors ${locale === 'zh' ? 'border-white/30 text-white' : 'border-white/10 text-zinc-500 hover:text-zinc-300'}`}>中文</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
