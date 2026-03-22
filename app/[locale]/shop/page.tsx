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
    <div className="pt-14 bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <h1 className="text-4xl font-bold mb-2 text-white">{t('title')}</h1>
        <p className="text-zinc-400 mb-10">{t('subtitle')}</p>
        <ShopClient souls={souls} filters={filters} downloadsLabel={t('downloads')} locale={locale} />
        <p className="mt-4 text-xs text-zinc-500">Free items download instantly. Premium and bundles require purchase.</p>
      </div>
    </div>
  )
}
