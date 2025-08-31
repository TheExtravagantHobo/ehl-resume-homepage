// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alex Sonne - The Extravagant Hobo',
  description: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.',
  metadataBase: new URL('https://www.theextravaganthobo.com/resume'),
  openGraph: {
    title: 'Alex Sonne - Strategic Leader in Technology and Policy',
    description: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.',
    url: 'https://www.theextravaganthobo.com/resume',
    siteName: 'The Extravagant Hobo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alex Sonne - The Extravagant Hobo',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Sonne - Strategic Leader',
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