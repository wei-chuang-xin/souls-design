import { getTranslations } from 'next-intl/server'
import { getSoulsByType } from '@/lib/souls'
import { SoulType } from '@/types/soul'
import ShopClient from './ShopClient'

export async function renderCategoryPage(locale: string, type: SoulType) {
  const t = await getTranslations({ locale, namespace: 'shop' })
  const souls = getSoulsByType(type)
  const typeLabels = t.raw('type_labels') as Record<'soul' | 'skill' | 'prompt' | 'team', string>
  const sellingLabels = t.raw('selling_labels') as Record<'free' | 'paid' | 'bundle', string>
  const categoryLabel = typeLabels[type]

  return (
    <div className="pt-14 bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <h1 className="text-4xl font-bold mb-2 text-white">{categoryLabel}</h1>
        <p className="text-zinc-400 mb-10">{t('category_subtitle', { type: categoryLabel })}</p>
        <ShopClient
          souls={souls}
          filters={[categoryLabel]}
          downloadsLabel={t('downloads')}
          locale={locale}
          marketplaceTitle={t('category_title', { type: categoryLabel })}
          marketplaceSubtitle={t('category_subtitle', { type: categoryLabel })}
          resultOneLabel={t('results_one')}
          resultOtherLabel={t('results_other')}
          emptyLabel={t('category_empty', { type: categoryLabel })}
          freeCtaLabel={t('free_cta')}
          paidCtaLabel={t('paid_cta')}
          typeLabels={typeLabels}
          sellingLabels={sellingLabels}
          hideFilters
        />
      </div>
    </div>
  )
}
