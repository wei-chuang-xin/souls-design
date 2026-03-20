import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'setup' })
  return { title: `${t('title')} — souls.design` }
}

const steps = [
  {
    number: '01',
    title: 'Download',
    desc: "Click the download button on any soul or skill page. You'll get a .zip file.",
  },
  {
    number: '02',
    title: 'Unzip',
    desc: "Extract the zip. You'll find files like SOUL.md, AGENTS.md, TOOLS.md.",
    code: 'unzip soul-name.zip',
    files: ['SOUL.md', 'AGENTS.md', 'TOOLS.md'],
  },
  {
    number: '03',
    title: 'Copy to your workspace',
    desc: 'Copy the extracted folder into your OpenClaw agent workspace.',
    code: 'cp -r soul-name/ ~/.openclaw/workspace-{your-agent}/',
  },
  {
    number: '04',
    title: 'Done',
    desc: 'Your agent will pick up the soul files on the next session. No restart needed.',
  },
]

export default async function SetupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'setup' })

  return (
    <div className="pt-14 bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 mb-5">
            <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Install Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">{t('title')}</h1>
          <p className="mt-3 text-zinc-400 text-base sm:text-lg">{t('subtitle')}</p>
          <div className="mt-8 h-px w-full bg-white/5" />
        </div>

        <ol className="space-y-10">
          {steps.map((step, i) => (
            <li key={step.number} className="flex gap-5 sm:gap-7">
              <div className="w-14 sm:w-16 flex-shrink-0">
                <span className="font-mono text-3xl sm:text-5xl font-bold leading-none text-white/10">{step.number}</span>
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h2>
                <p className="mt-1.5 text-sm sm:text-base text-zinc-400 leading-relaxed">{step.desc}</p>

                {step.files && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {step.files.map((f) => (
                      <span key={f} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono border border-white/10 bg-white/[0.02] text-zinc-400">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {step.code && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-white/10 bg-[#0d0d0f]">
                    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/10">
                      <span className="block w-2 h-2 rounded-full bg-zinc-700" />
                      <span className="block w-2 h-2 rounded-full bg-zinc-700" />
                      <span className="block w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                    <pre className="px-4 py-3 overflow-x-auto text-sm font-mono text-zinc-300 whitespace-pre">$ {step.code}</pre>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
