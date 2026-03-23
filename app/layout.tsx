import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'souls.design — Give your agent a soul.',
  description: 'Browse and download production-tested OpenClaw souls, skills, and prompts — free.',
  openGraph: {
    title: 'souls.design — Give your agent a soul.',
    description: 'Browse and download production-tested OpenClaw souls, skills, and prompts — free.',
    url: 'https://souls.design',
    siteName: 'souls.design',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
