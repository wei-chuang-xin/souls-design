import { getTranslations } from 'next-intl/server'
import { getAllSlugs, getSoulBySlug } from '@/lib/souls'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import SoulDetail from '@/components/SoulDetail'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  const locales = routing.locales
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
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
  const type = soul.item_type as 'soul' | 'skill' | 'prompt' | 'team'

  return (
    <div className="pt-14">
      <SoulDetail
        name={soul.name}
        type={type}
        subtitle={soul.subtitle}
        description={soul.description || soul.subtitle}
        version={soul.latest_version?.version}
        author={soul.creator.display_name}
        downloads={soul.stats.downloads}
        tags={soul.tags}
        readme={soul.readme_content || undefined}
        files={soul.file_manifest}
        license={soul.license}
        backHref={`/${locale}/shop`}
        downloadHref={`/downloads/${slug}.zip`}
      />
    </div>
  )
}
