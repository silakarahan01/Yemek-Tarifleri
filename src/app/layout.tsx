/**
 * Root Layout Component
 *
 * Server component: metadata, fonts, global styles
 * Client providers'ları wrap et
 */

import React from 'react'
import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import { Header } from '@/components/organisms/Header/Header'
import { Footer } from '@/components/organisms/Footer/Footer'
import './globals.css'

// MSW initialization (development'ta mock API çalışması için)
if (process.env.NODE_ENV === 'development') {
  // Client-side'da initialize edilecek
  // src/lib/providers.tsx'te yapılır
}

/**
 * Metadata - SEO, Open Graph, vb
 */
export const metadata: Metadata = {
  title: 'Yemek Tarifleri | En İyi Tarif Sitesi',
  description: 'Binlerce leziz tarifi keşfet, favorilere ekle ve paylaş.',
  keywords: ['tarif', 'yemek', 'mutfak', 'resep'],
  authors: [{ name: 'Yemek Tarifleri Team' }],
  creator: 'Yemek Tarifleri',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://yemek-tarifleri.com',
    siteName: 'Yemek Tarifleri',
    title: 'Yemek Tarifleri | En İyi Tarif Sitesi',
    description: 'Binlerce leziz tarifi keşfet, favorilere ekle ve paylaş.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yemek Tarifleri',
    description: 'Binlerce leziz tarifi keşfet, favorilere ekle ve paylaş.',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * Root layout component
 * Tüm pages bu layout'u kullanır
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr" suppressHydrationWarning style={{ colorScheme: 'light' }}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || ''} />
        <link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Dark class ve localStorage temizle — tek tema */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.remove('dark');try{localStorage.removeItem('theme')}catch(e){}` }} />
      </head>

      <body className="flex flex-col min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#1F2937', colorScheme: 'light' }}>
        {/* Client-side providers */}
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
