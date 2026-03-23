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
  const typeLabels = t.raw('type_labels') as Record<'soul' | 'skill' | 'prompt' | 'team', string>
  const sellingLabels = t.raw('selling_labels') as Record<'free' | 'paid' | 'bundle', string>
  const categoryLinks = t.raw('category_links') as { label: string; href: string }[]

  return (
    <div className="pt-14 bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <h1 className="text-4xl font-bold mb-2 text-white">{t('title')}</h1>
        <p className="text-zinc-400 mb-10">{t('subtitle')}</p>
        <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">{t('browse_categories')}</h2>
            <p className="mt-1 text-sm text-zinc-400">{t('browse_categories_subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryLinks.map((item) => (
              <a
                key={item.href}
                href={`/${locale}${item.href}`}
                className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <ShopClient
          souls={souls}
          filters={filters}
          downloadsLabel={t('downloads')}
          locale={locale}
          marketplaceTitle={t('marketplace_title')}
          marketplaceSubtitle={t('marketplace_subtitle')}
          resultOneLabel={t('results_one')}
          resultOtherLabel={t('results_other')}
          emptyLabel={t('empty')}
          freeCtaLabel={t('free_cta')}
          paidCtaLabel={t('paid_cta')}
          typeLabels={typeLabels}
          sellingLabels={sellingLabels}
        />
        <p className="mt-4 text-xs text-zinc-500">{t('footnote')}</p>
      </div>
    </div>
  )
}
