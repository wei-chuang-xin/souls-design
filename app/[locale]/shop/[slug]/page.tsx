import { getTranslations } from 'next-intl/server'
import { getAllSlugs, getSoulBySlug } from '@/lib/souls'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import SoulDetail from '@/components/SoulDetail'
import { auth } from '@/auth'
import { getDownloadAccessState, getUserFavorites, toggleFavorite } from '@/lib/user-actions'
import { buildAlternates, buildOg, localePath, siteUrl } from '@/lib/seo'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  const locales = routing.locales
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const soul = getSoulBySlug(slug)
  if (!soul) return {}

  const title = `${soul.name} — souls.design`
  const description = soul.subtitle
  const path = `/shop/${slug}`

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOg(localePath(locale, path), title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}


export default async function SoulPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const soul = getSoulBySlug(slug)
  if (!soul) notFound()

  const t = await getTranslations({ locale, namespace: 'soul_detail' })
  const type = soul.item_type as 'soul' | 'skill' | 'prompt' | 'team'

  // Check if user has favorited this soul
  const session = await auth()
  let isFavorited = false
  if (session?.user?.id) {
    const favorites = await getUserFavorites()
    isFavorited = favorites.includes(slug)
  }

  const downloadAccessState = await getDownloadAccessState(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: soul.name,
    description: soul.subtitle,
    codeRepository: `${siteUrl}/${locale}/shop/${slug}`,
    programmingLanguage: 'Markdown',
    license: soul.license || 'MIT',
    author: {
      '@type': 'Person',
      name: soul.creator.display_name,
    },
    keywords: soul.tags?.join(', '),
  }

  return (
    <div className="pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        downloadHref={`/api/download/${slug}`}
        slug={slug}
        isFavorited={isFavorited}
        onToggleFavorite={toggleFavorite}
        pricingModel={soul.price?.model}
        priceAmountCents={soul.price?.amount_cents}
        priceCurrency={soul.price?.currency}
        downloadAccessState={downloadAccessState}
      />
    </div>
  )
}
