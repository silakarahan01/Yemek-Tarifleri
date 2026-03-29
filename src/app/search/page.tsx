'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchRecipesQuery } from '@/services/query/recipe.queries'
import { RecipeCard } from '@/components/molecules/RecipeCard/RecipeCard'
import { RecipeCardSkeleton } from '@/components/molecules/RecipeCard/RecipeCardSkeleton'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)

  const { data: results, isLoading } = useSearchRecipesQuery(query)
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`)
    }
  }

  const popularSearches = ['Menemen', 'Çorba', 'Tatlı', 'Salata', 'Çay Saati Tarifleri']

  return (
    <div className="min-h-screen dark:bg-gray-900" style={{ backgroundColor: '#f9f7f4' }}>
      {/* Hero Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white py-16 md:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-400 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-800 rounded-full opacity-20 blur-3xl" />
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {query ? `„${query}" için sonuçlar` : 'Tarif Ara'}
              </h1>
              <p className="text-lg md:text-xl text-brand-100 font-light">
                {query
                  ? 'Aradığınız tarifləri buldum'
                  : 'Binlerce tarif arasında aradığınızı bulun'}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tarif ara... (örn: Menemen, Çorba, Tatlı)"
                  className={cn(
                    'flex-1 px-6 py-4 rounded-lg',
                    'bg-white/95 dark:bg-gray-800 text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-gray-400',
                    'border-2 border-transparent',
                    'focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20',
                    'transition-all duration-200'
                  )}
                  autoFocus
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

            {/* Popular Searches */}
            {!query && (
              <div className="pt-8 space-y-3">
                <p className="text-brand-100 text-sm font-medium">Popüler aramalar:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div className="dark:bg-gray-900 min-h-screen py-16" style={{ backgroundColor: '#f9f7f4' }}>
        <div className="container">
          {query ? (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                  ))}
                </div>
              ) : results && results.length > 0 ? (
                <>
                  <div className="mb-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      {results.length} tarif bulundu
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={isFavorite(recipe.id)}
                        onFavoriteClick={() => toggleFavorite(recipe.id)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Tarif bulunamadı
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    „{query}" ile ilgili bir tarif yok. Farklı anahtar kelimelerle aramayı deneyin.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link
                      href="/recipes"
                      className={cn(
                        'px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium',
                        'transition-colors'
                      )}
                    >
                      Tüm Tarifləri Gör
                    </Link>
                    <button
                      onClick={() => setSearchInput('')}
                      className={cn(
                        'px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
                        'rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors'
                      )}
                    >
                      Aramayı Temizle
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📍</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tarif Ara
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Yukarıda arama çubuğunu kullanarak tarif bulmaya başlayın
              </p>
              <Link
                href="/recipes"
                className={cn(
                  'inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium',
                  'transition-colors'
                )}
              >
                Tüm Tarifləri Gör
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen dark:bg-gray-900" style={{ backgroundColor: '#f9f7f4' }} />}>
      <SearchContent />
    </Suspense>
  )
}
