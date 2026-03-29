/**
 * Footer Component
 * 3-column layout with quick links and categories
 */

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FooterLink {
  label: string
  href: string
}

const quickLinks: FooterLink[] = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Tarifler', href: '/recipes' },
  { label: 'Ara', href: '/search' },
  { label: 'Favorilerim', href: '/favorites' },
]

const categories: FooterLink[] = [
  { label: 'Kahvaltı', href: '/recipes?category=breakfast' },
  { label: 'Ana Yemek', href: '/recipes?category=main' },
  { label: 'Çorba', href: '/recipes?category=soup' },
  { label: 'Tatlı', href: '/recipes?category=dessert' },
  { label: 'Salata', href: '/recipes?category=salad' },
]

const currentYear = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-20 pt-16 pb-8">
      {/* Main content */}
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo + Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍳</span>
              <span className="text-white font-bold text-xl">TarifKüpü</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Binlerce leziz Türk tarifini keşfet, favorilere ekle ve mutfağında harika yemekler hazırla.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-brand-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.5 10.5 0 01-10 5V3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-brand-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-brand-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-brand-500 transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} TarifKüpü. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Kullanım Şartları
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              İletişim
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
