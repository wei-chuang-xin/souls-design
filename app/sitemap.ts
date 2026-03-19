import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/souls'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs()
  const base = 'https://souls.design'

  const staticPages = ['', '/shop', '/about', '/setup', '/legal/terms', '/legal/privacy'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const soulPages = slugs.map((slug) => ({
    url: `${base}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...soulPages]
}
