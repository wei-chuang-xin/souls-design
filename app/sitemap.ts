import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/souls'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs()
  const base = 'https://souls.design'
  const categoryPaths = ['/shop/souls', '/shop/skills', '/shop/prompts', '/shop/teams']

  const localizedStaticPages = routing.locales.flatMap((locale) =>
    ['', '/shop', '/about', '/setup', '/legal/terms', '/legal/privacy', ...categoryPaths].map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : path.startsWith('/shop/') && path !== '/shop' ? 0.7 : 0.8,
    }))
  )

  const localizedSoulPages = routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${base}/${locale}/shop/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...localizedStaticPages, ...localizedSoulPages]
}
