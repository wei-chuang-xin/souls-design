import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: `${t('title')} — souls.design` }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="pt-14 bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-4">{t('eyebrow')}</p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-white text-balance">
            {t('title')}
          </h1>
          <div className="mt-8 h-px w-16 bg-gradient-to-r from-violet-500/70 to-transparent" />
        </div>

        <div className="space-y-7 text-zinc-300 leading-relaxed text-sm sm:text-base">
          <p className="text-lg sm:text-xl font-medium text-white">{t('lead')}</p>

          <p>{t('p1')}</p>

          <blockquote className="pl-5 border-l border-violet-500/30 text-zinc-400">
            {t('quote')}
          </blockquote>

          <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{t('soul_line')}</p>

          <p>{t('p2')}</p>

          <p className="font-medium text-white">{t('p3')}</p>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5">
          <p className="text-xs text-zinc-500">{t('footer')}</p>
        </div>
      </div>
    </div>
  )
}
