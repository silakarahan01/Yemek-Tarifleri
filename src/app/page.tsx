/**
 * Home / Landing Page
 *
 * Modern hero section with search, features, and trending recipes
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const features = [
    {
      icon: '🎯',
      title: 'Kolay Tarifler',
      description: 'Başlangıçtan ileri seviyeye kadar özel olarak seçilmiş tarifler',
    },
    {
      icon: '⭐',
      title: 'Lezzetli Seçimler',
      description: 'Topluluk tarafından onaylı, en popüler ve eğlenceli tarifler',
    },
    {
      icon: '❤️',
      title: 'Favorilere Ekle',
      description: 'Sevdiğin tarifləri kaydet ve istediğin zaman eriş',
    },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white py-20 md:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-400 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-800 rounded-full opacity-20 blur-3xl" />
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-slideUp">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Binlerce Türk Tarifi Keşfet
              </h1>
              <p className="text-xl md:text-2xl text-brand-100 font-light">
                Lezzetli, kolay ve sağlıklı mutfak yolculuğuna başla
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tarif ara... (örn: Menemen, Çorba, Tatlı)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'flex-1 px-6 py-4 rounded-lg',
                    'bg-white/95 dark:bg-gray-800 text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-gray-400',
                    'border-2 border-transparent',
                    'focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    'px-8 py-4 rounded-lg font-semibold',
                    'bg-white text-brand-600 hover:bg-brand-50',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-white/20'
                  )}
                >
                  Ara
                </button>
              </div>
            </form>

            {/* CTA */}
            <Link
              href="/recipes"
              className={cn(
                'inline-block px-8 py-3 rounded-lg font-semibold',
                'bg-white/20 hover:bg-white/30 text-white border border-white/40',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-white/30'
              )}
            >
              Tüm Tarifləri Gözle →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Neden TarifKüpü?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            En iyi tarif deneyimini yaşamak için tasarlandı
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'card p-8 text-center space-y-4',
                  'animate-slideUp'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              🔥 Popüler Tarifler
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Şu anda herkese favorite olan tarifler
            </p>
          </div>

          {/* Quick Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Menemen', emoji: '🍳', color: 'from-orange-200 to-orange-100' },
              { name: 'Çoban Salatası', emoji: '🥗', color: 'from-green-200 to-green-100' },
              { name: 'Mercimek Çorbası', emoji: '🍲', color: 'from-red-200 to-orange-100' },
              { name: 'Baklava', emoji: '🍯', color: 'from-yellow-200 to-orange-100' },
            ].map((recipe, index) => (
              <Link
                key={index}
                href="/recipes"
                className={cn(
                  'card p-8 text-center space-y-4 group hover:shadow-lg',
                  'bg-gradient-to-br',
                  recipe.color
                )}
              >
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {recipe.emoji}
                </div>
                <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Keşfet →
                </p>
              </Link>
            ))}
          </div>

          {/* Large CTA */}
          <div className="text-center pt-8">
            <Link
              href="/recipes"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-lg',
                'bg-brand-500 hover:bg-brand-600 text-white font-semibold',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2'
              )}
            >
              Hemen Keşfet Başla
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter/Social CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-brand-500/10 to-brand-600/10 dark:from-brand-900/20 dark:to-brand-800/20 border-t border-gray-200 dark:border-gray-800">
        <div className="container max-w-2xl text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Harika Tarifler Hiç Kaçırma
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            En yeni ve en popüler tarifler doğrudan sana gelsin
          </p>

          {/* Social links placeholder */}
          <div className="flex justify-center gap-4">
            {[
              { icon: '𝕏', label: 'Twitter' },
              { icon: '📷', label: 'Instagram' },
              { icon: 'ƒ', label: 'Facebook' },
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className={cn(
                  'w-12 h-12 rounded-full bg-white dark:bg-gray-800',
                  'flex items-center justify-center text-xl font-bold text-brand-600',
                  'hover:bg-brand-50 dark:hover:bg-gray-700',
                  'transition-colors duration-200',
                  'border border-gray-200 dark:border-gray-700'
                )}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
