/**
 * Recipes Listing Page
 *
 * Displays all recipes with pagination and favoriting
 */

'use client'

import { useState } from 'react'
import { useRecipesQuery } from '@/services/query/recipe.queries'
import { RecipeCard } from '@/components/molecules/RecipeCard/RecipeCard'
import { RecipeCardSkeleton } from '@/components/molecules/RecipeCard/RecipeCardSkeleton'
import { useFavorites } from '@/hooks/useFavorites'

export default function RecipesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  // TanStack Query ile tarifleri çek
  const { data, isLoading, error } = useRecipesQuery({
    page,
    pageSize: 20,
    search: search || undefined,
  })

  // Favorites hook
  const { isFavorite, toggleFavorite } = useFavorites()

  const recipes = data?.items || []
  const hasMore = data?.hasMore || false
  const total = data?.total || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Tarif Koleksiyonu</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {total} leziz tarifi keşfet ve hazırla
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tarif ara..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
            >
              Ara
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-8">
            <p className="font-semibold">Hata oluştu</p>
            <p className="text-sm">{error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? // Skeleton loading state
              Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : // Recipe cards
              recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onFavoriteClick={() => toggleFavorite(recipe.id)}
                />
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {search ? 'Aramanızla eşleşen tarif bulunamadı' : 'Henüz tarif yok'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-brand-500 hover:text-brand-600 font-medium"
              >
                Aramayı temizle
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && recipes.length > 0 && (
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Önceki
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Sayfa</span>
              <span className="font-bold text-gray-900 dark:text-white">{page}</span>
              <span className="text-gray-600 dark:text-gray-400">/</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {Math.ceil(total / 20)}
              </span>
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sonraki →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
