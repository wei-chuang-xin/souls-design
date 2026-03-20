import { useTranslations } from 'next-intl'
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

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('home')
  const souls = getAllSouls()

  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          {t('badge')}
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          {t('h1_1')}<br />
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">{t('h1_2')}</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>
        <Link
          href="shop"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors"
        >
          {t('cta')}
        </Link>
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500">
          <span><strong className="text-white">{souls.length}</strong> {t('stats_souls')}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
          <span><strong className="text-white">6,000+</strong> {t('stats_downloads')}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
          <span><strong className="text-white">MIT</strong> {t('stats_license')}</span>
        </div>
      </section>

      {/* Pain points */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-4">{t('pain_title')}</h2>
        <p className="text-zinc-400 text-center mb-12">{t('pain_subtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(t.raw('pain_items') as string[]).map((pain: string) => (
            <div key={pain} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-zinc-300">
              <span className="text-red-400 mr-2">✗</span>{pain}
            </div>
          ))}
        </div>
      </section>

      {/* Research */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-4">{t('research_title')}</h2>
        <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">{t('research_subtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { stat: '10x', label: t.raw('pain_items') ? 'Expert identity matching delivered the equivalent of a 10x model upgrade.' : '', source: 'ExpertPrompting, Xu et al. 2023' },
            { stat: '3–5x', label: 'Structured reasoning baked into the soul produces 3–5x improvement on complex tasks.', source: 'Tree of Thought, NeurIPS 2023' },
            { stat: '+26.9%', label: 'Agents with built-in reflection loops outperform those without.', source: 'Metacognitive Prompting, NAACL 2024' },
          ].map((item) => (
            <div key={item.stat} className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
              <div className="text-4xl font-bold text-violet-400 mb-3">{item.stat}</div>
              <p className="text-zinc-300 text-sm mb-3">{item.label}</p>
              <p className="text-zinc-500 text-xs">— {item.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-12">{t('steps_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {(t.raw('steps') as {num: string; title: string; desc: string}[]).map((step) => (
            <div key={step.num} className="text-center">
              <div className="text-5xl font-bold text-white/10 mb-4">{step.num}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-zinc-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-12">{t('testimonials_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(t.raw('testimonials') as string[]).map((quote: string, i: number) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-zinc-300 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center border-t border-white/5">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('bottom_cta_title')}</h2>
        <p className="text-zinc-500 mb-8">{t('bottom_cta_sub')}</p>
        <Link
          href="shop"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors"
        >
          {t('cta')}
        </Link>
      </section>
    </div>
  )
}
