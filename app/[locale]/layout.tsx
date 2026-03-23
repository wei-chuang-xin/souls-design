import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Nav from '@/components/Nav'
import NavAuthButton from '@/components/NavAuthButton'
import Footer from '@/components/Footer'
import { buildAlternates, buildOg, localePath } from '@/lib/seo'


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const path = localePath(locale)
  return {
    metadataBase: new URL('https://souls.design'),
    alternates: buildAlternates(locale, ''),
    openGraph: buildOg(path, 'souls.design', 'Browse production-tested souls, skills, prompts, and teams for OpenClaw.'),
    twitter: {
      card: 'summary_large_image',
      title: 'souls.design',
      description: 'Browse production-tested souls, skills, prompts, and teams for OpenClaw.',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'zh')) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Nav authSlot={<NavAuthButton locale={locale} />} />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  )
}
