'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
    <main className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#f97316' }} className="relative overflow-hidden text-white py-20 md:py-32">
        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Binlerce Türk Tarifi Keşfet
              </h1>
              <p className="text-xl md:text-2xl font-light" style={{ opacity: 0.9 }}>
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
                  className="flex-1 px-6 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-lg font-semibold bg-white text-orange-600 hover:bg-gray-100"
                >
                  Ara
                </button>
              </div>
            </form>

            {/* CTA */}
            <Link
              href="/recipes"
              className="inline-block px-8 py-3 rounded-lg font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white"
            >
              Tüm Tarifləri Gözle →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Neden TarifKüpü?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            En iyi tarif deneyimini yaşamak için tasarlandı
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 text-center space-y-4">
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              🔥 Popüler Tarifler
            </h2>
            <p className="text-gray-600">
              Şu anda herkese favorite olan tarifler
            </p>
          </div>

          {/* Quick Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Menemen', emoji: '🍳', color: 'from-orange-300 to-orange-100' },
              { name: 'Çoban Salatası', emoji: '🥗', color: 'from-yellow-300 to-yellow-100' },
              { name: 'Mercimek Çorbası', emoji: '🍲', color: 'from-red-300 to-red-100' },
              { name: 'Baklava', emoji: '🍯', color: 'from-orange-200 to-yellow-100' },
            ].map((recipe, index) => (
              <Link
                key={index}
                href="/recipes"
                className={`bg-gradient-to-br ${recipe.color} p-8 text-center space-y-4 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="text-6xl group-hover:scale-110">{recipe.emoji}</div>
                <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
              </Link>
            ))}
          </div>

          {/* Large CTA */}
          <div className="text-center pt-8">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Hemen Keşfet Başla
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 border-t border-gray-200">
        <div className="container max-w-2xl text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Harika Tarifler Hiç Kaçırma
          </h2>
          <p className="text-gray-600">
            En yeni ve en popüler tarifler doğrudan sana gelsin
          </p>

          <div className="flex justify-center gap-4">
            {[
              { icon: '𝕏', label: 'Twitter' },
              { icon: '📷', label: 'Instagram' },
              { icon: 'ƒ', label: 'Facebook' },
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl font-bold text-orange-600 hover:bg-gray-50 border border-gray-300"
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
