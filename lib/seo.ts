import { routing } from '@/i18n/routing'

const SITE_URL = 'https://souls.design'

export function absoluteUrl(path: string) {
  if (!path.startsWith('/')) return `${SITE_URL}/${path}`
  return `${SITE_URL}${path}`
}

export function localePath(locale: string, path = '') {
  return `/${locale}${path}`
}

export function buildLanguageAlternates(path: string) {
  return Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(localePath(locale, path))]))
}

export function buildAlternates(locale: string, path: string) {
  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages: {
      ...buildLanguageAlternates(path),
      'x-default': absoluteUrl(localePath(routing.defaultLocale, path)),
    },
  }
}

export function buildOg(path: string, title: string, description: string) {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: 'souls.design',
    type: 'website' as const,
  }
}

export const siteUrl = SITE_URL
