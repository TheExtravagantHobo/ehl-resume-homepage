// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Extravagant Hobo - Alex Sonne',
  description: 'Alex Sonne - Strategic Leader in Technology and Policy',
  metadataBase: new URL('https://www.theextravaganthobo.com'),
  openGraph: {
    title: 'The Extravagant Hobo - Alex Sonne',
    description: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.',
    url: 'https://www.theextravaganthobo.com',
    siteName: 'The Extravagant Hobo',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.theextravaganthobo.com',
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