import { useTranslations, useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllSouls } from '@/lib/souls'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: 'souls.design — ' + t('h1_1') + ' ' + t('h1_2'),
    description: t('subtitle'),
  }
}

function NoiseCanvas() {
  return null // SSR-safe: skip canvas
}

function HeroGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'oklch(0.62 0.24 293)' }}
      />
      <div
        className="absolute top-40 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full opacity-10 blur-[100px]"
        style={{ background: 'oklch(0.55 0.26 308)' }}
      />
    </div>
  )
}

export default function HomePage() {
  const t = useTranslations('home')
  const locale = useLocale()
  const souls = getAllSouls()
  const painItems = t.raw('pain_items') as string[]
  const steps = t.raw('steps') as { num: string; title: string; desc: string }[]
  const testimonials = t.raw('testimonials') as string[]
  const categories = t.raw('categories') as { title: string; desc: string; href: string }[]
  const heroChips = t.raw('hero_chips') as { label: string; href: string }[]

  const painEmojis = ['😵', '🎭', '🔁', '📝', '🤖', '🔀']

  return (
    <div className="pt-14 bg-zinc-950 min-h-screen">

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24 text-center overflow-hidden">
        <HeroGlow />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            {t('badge')}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            <span className="block">{t('h1_1')}</span>
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">{t('h1_2')}</span>
          </h1>
          <p className="relative mx-auto mt-6 max-w-xl text-base text-zinc-400 leading-relaxed sm:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/shop/souls`}
              className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/10 transition-colors"
            >
              {t('secondary_cta')}
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {heroChips.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-500">
            <span><strong className="text-white">{souls.length}</strong> {t('stats_souls')}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
            <span><strong className="text-white">6,000+</strong> {t('stats_downloads')}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
            <span><strong className="text-white">MIT</strong> {t('stats_license')}</span>
          </div>
        </div>
      </section>


      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('categories_title')}</h2>
          <p className="text-zinc-400 text-sm sm:text-base">{t('categories_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={`/${locale}${category.href}`}
              className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/15 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                <span className="text-zinc-500 group-hover:text-white transition-colors">→</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{category.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('pain_title')}</h2>
          <p className="text-zinc-400 text-sm sm:text-base">{t('pain_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {painItems.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="mb-3 text-2xl">{painEmojis[i] || '⚠️'}</div>
              <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research / What is a soul */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 border-t border-white/5 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">{t('research_title')}</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-balance leading-snug">
          {t('research_subtitle')}
        </h2>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('steps_title')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="text-5xl font-bold text-white/10 mb-4">{step.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 border-t border-white/5">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">{t('testimonials_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((quote, i) => (
            <figure key={i} className="flex flex-col justify-between gap-6 rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-sm text-zinc-400 leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </figure>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center border-t border-white/5">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 text-balance">{t('bottom_cta_title')}</h2>
        <p className="text-zinc-500 mb-8 text-sm sm:text-base">{t('bottom_cta_sub')}</p>
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors"
        >
          {t('cta')}
        </Link>
        <p className="mt-5 text-xs text-zinc-600">{t('bottom_trust_note')}</p>
      </section>
    </div>
  )
}
