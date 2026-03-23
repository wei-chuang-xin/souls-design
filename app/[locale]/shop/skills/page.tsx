import { getTranslations } from 'next-intl/server'
import { renderCategoryPage } from '../category-page'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  const label = t('type_labels.skill')
  return {
    title: `${label} — souls.design`,
    description: t('category_subtitle', { type: label }),
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return renderCategoryPage(locale, 'skill')
}
