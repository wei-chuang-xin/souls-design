import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllSlugs, getSoulBySlug } from '@/lib/souls'
import { TYPE_COLORS, AVATAR_COLORS } from '@/lib/soul-utils'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  const locales = routing.locales
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const soul = getSoulBySlug(slug)
  if (!soul) return {}
  return {
    title: `${soul.name} — souls.design`,
    description: soul.subtitle,
    openGraph: { title: soul.name, description: soul.subtitle },
  }
}

export default async function SoulPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const soul = getSoulBySlug(slug)
  if (!soul) notFound()

  const t = await getTranslations({ locale, namespace: 'soul_detail' })
  const type = soul.item_type
  const avatarColor = AVATAR_COLORS[type] || AVATAR_COLORS.skill
  const typeColor = TYPE_COLORS[type] || TYPE_COLORS.skill

  return (
    <div className="pt-14">
      <div className="mx-auto max-w-4xl px-6 pt-12 pb-24">
        <Link href={`/${locale}/shop`} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-10">
          {t('back')}
        </Link>
        <div className="flex items-start gap-5 mb-8">
          <div className={`flex-shrink-0 h-16 w-16 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-2xl`}>
            {soul.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{soul.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor}`}>{type}</span>
              {soul.latest_version && <span className="text-xs text-zinc-500">v{soul.latest_version.version}</span>}
              <span className="text-xs text-zinc-500">by {soul.creator.display_name}</span>
              <span className="text-xs text-zinc-500">↓ {soul.stats.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <a
          href={`/downloads/${slug}.zip`}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors mb-10"
        >
          {t('download')}
        </a>

        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t('about')}</h2>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{soul.description}</p>
        </div>

        {soul.tags?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">{t('tags')}</h2>
            <div className="flex flex-wrap gap-2">
              {soul.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full border border-white/10 text-zinc-400">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {soul.readme_content && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">{t('readme')}</h2>
            <pre className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-sm text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
              {soul.readme_content}
            </pre>
          </div>
        )}

        {soul.file_manifest?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">{t('files')}</h2>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              {soul.file_manifest.map((file) => (
                <div key={file} className="text-sm text-zinc-400 font-mono py-1 border-b border-white/5 last:border-0">{file}</div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-sm text-zinc-500">
          <span className="text-zinc-300 font-medium">{t('license_prefix')}</span> {soul.license} · Source: souls.zip · {soul.creator.display_name}
        </div>
      </div>
    </div>
  )
}
