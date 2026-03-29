'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useSearchRecipesQuery } from '@/services/query/recipe.queries'
import { RecipeCard } from '@/components/molecules/RecipeCard/RecipeCard'
import { RecipeCardSkeleton } from '@/components/molecules/RecipeCard/RecipeCardSkeleton'
import { useFavorites } from '@/hooks/useFavorites'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)

  const { data: results, isLoading } = useSearchRecipesQuery(query)
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-12">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Tarif Ara
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {query ? `"${query}" sonuçları gösteriliyor` : 'Tarif bulmak için bir arama terimi girin'}
          </p>

          {/* Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Navigation handled by URL params in real app
            }}
            className="mb-8"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tarif adı veya malzeme ara..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
              >
                Ara
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {query ? (
          isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : results && results.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">Tarif bulunamadı</p>
              <p className="text-gray-500 dark:text-gray-500">Farklı anahtar kelimelerle aramayı deneyin</p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">Tarif bulmak için yukarıda bir arama terimi girin</p>
          </div>
        )}
      </div>
    </div>
  )
}
