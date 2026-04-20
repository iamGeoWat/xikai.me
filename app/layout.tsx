import type { Metadata } from 'next'
import { Newsreader, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: `${siteConfig.author} — ${siteConfig.domain}`,
    template: `%s — ${siteConfig.domain}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.author,
    description: siteConfig.description,
    siteName: siteConfig.domain,
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
