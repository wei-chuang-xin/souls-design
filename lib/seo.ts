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

export function buildAlternates(path: string) {
  return {
    canonical: absoluteUrl(localePath(routing.defaultLocale, path)),
    languages: buildLanguageAlternates(path),
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
