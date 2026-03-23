import { getTranslations } from 'next-intl/server'
import { renderCategoryPage } from '../category-page'
import { buildAlternates, buildOg, localePath } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  const label = t('type_labels.skill')
  const title = `${label} — souls.design`
  const description = t('category_subtitle', { type: label })
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/shop/skills'),
    openGraph: buildOg(localePath(locale, '/shop/skills'), title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return renderCategoryPage(locale, 'skill')
}
