import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'setup' })
  return { title: `${t('title')} — souls.design` }
}

const steps = [
  { num: '01', title: 'Download', desc: "Click the download button on any soul or skill page. You'll get a .zip file.", code: null },
  { num: '02', title: 'Unzip', desc: "Extract the zip. You'll find files like SOUL.md, AGENTS.md, TOOLS.md.", code: 'unzip soul-name.zip' },
  { num: '03', title: 'Copy to your workspace', desc: 'Copy the extracted folder into your OpenClaw agent workspace.', code: 'cp -r soul-name/ ~/.openclaw/workspace-{your-agent}/' },
  { num: '04', title: 'Done', desc: 'Your agent will pick up the soul files on the next session. No restart needed.', code: null },
]

export default async function SetupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'setup' })

  return (
    <div className="pt-14">
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-24">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-zinc-400 mb-14">{t('subtitle')}</p>
        <div className="space-y-10">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-6">
              <div className="text-3xl font-bold text-white/10 w-10 flex-shrink-0">{step.num}</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">{step.title}</h2>
                <p className="text-zinc-400 text-sm mb-3">{step.desc}</p>
                {step.code && (
                  <pre className="rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 font-mono overflow-x-auto">{step.code}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
