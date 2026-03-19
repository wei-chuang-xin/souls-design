'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="border-t border-white/5 mt-24 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <span>{t('copyright')}</span>
        <div className="flex gap-6">
          <Link href={`/${locale}/legal/terms`} className="hover:text-zinc-300 transition-colors">{t('terms')}</Link>
          <Link href={`/${locale}/legal/privacy`} className="hover:text-zinc-300 transition-colors">{t('privacy')}</Link>
        </div>
      </div>
    </footer>
  )
}
