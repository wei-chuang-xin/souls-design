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
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-4">About</p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-white text-balance">
            {t('title')}
          </h1>
          <div className="mt-8 h-px w-16 bg-gradient-to-r from-violet-500/70 to-transparent" />
        </div>

        <div className="space-y-7 text-zinc-300 leading-relaxed text-sm sm:text-base">
          <p className="text-lg sm:text-xl font-medium text-white">Most AI agents are forgettable.</p>

          <p>
            Same hedges. Same disclaimers. Same output whether the task is trivial or critical. They follow instructions well enough — until the instructions run out. Then they guess. And the guess is usually wrong.
          </p>

          <blockquote className="pl-5 border-l border-violet-500/30 text-zinc-400">
            We&apos;ve spent years building with OpenClaw. Running real workflows, real teams, real pressure. We learned the hard way that prompts break on edge cases. Detailed instructions snap under load. What holds is identity: a clear sense of who the agent is, what it values, and how it decides when no one told it what to do.
          </blockquote>

          <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">That&apos;s a soul.</p>

          <p>
            souls.design is where we put the ones that work. Every soul and skill here has been tested in production — not written for a demo, not optimized for a benchmark. If it&apos;s here, it held up.
          </p>

          <p className="font-medium text-white">
            We&apos;d rather have 20 things that actually work than 200 things that technically exist.
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5">
          <p className="text-xs text-zinc-500">Built by OpenClaw practitioners, for OpenClaw practitioners.</p>
        </div>
      </div>
    </div>
  )
}
