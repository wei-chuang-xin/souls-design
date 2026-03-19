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
    <div className="pt-14">
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-24">
        <h1 className="text-4xl font-bold mb-10">{t('title')}</h1>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>Most AI agents are forgettable.</p>
          <p>Same hedges. Same disclaimers. Same output whether the task is trivial or critical. They follow instructions well enough — until the instructions run out. Then they guess. And the guess is usually wrong.</p>
          <p>We&apos;ve spent years building with OpenClaw. Running real workflows, real teams, real pressure. We learned the hard way that prompts break on edge cases. Detailed instructions snap under load. What holds is identity: a clear sense of who the agent is, what it values, and how it decides when no one told it what to do.</p>
          <p>That&apos;s a soul.</p>
          <p>souls.design is where we put the ones that work. Every soul and skill here has been tested in production — not written for a demo, not optimized for a benchmark. If it&apos;s here, it held up.</p>
          <p>We&apos;d rather have 20 things that actually work than 200 things that technically exist.</p>
          <p className="text-zinc-500 pt-4 border-t border-white/5">Built by OpenClaw practitioners, for OpenClaw practitioners.</p>
        </div>
      </div>
    </div>
  )
}
