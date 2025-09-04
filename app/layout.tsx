// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Name Name - Title Title',
  description: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.',
  metadataBase: new URL('https://www.yoursite.com/'),
  openGraph: {
    title: 'Name Name - Strategic Leader in Technology and Policy',
    description: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.',
    url: 'https://www.yoursite.com/',
    siteName: 'Site Name',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Name Name - Site Name',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Name Name - Strategic Leader',
    description: 'Strategic leader in AI/ML, defense tech, and innovation management',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}