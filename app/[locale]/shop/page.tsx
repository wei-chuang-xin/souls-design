import { getTranslations } from 'next-intl/server'
import { getAllSouls } from '@/lib/souls'
import ShopClient from './ShopClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  return { title: `${t('title')} — souls.design`, description: t('subtitle') }
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  const souls = getAllSouls()
  const filters = t.raw('filters') as string[]

  return (
    <div className="pt-14">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-zinc-400 mb-10">{t('subtitle')}</p>
        <ShopClient souls={souls} filters={filters} downloadsLabel={t('downloads')} locale={locale} />
      </div>
    </div>
  )
}
