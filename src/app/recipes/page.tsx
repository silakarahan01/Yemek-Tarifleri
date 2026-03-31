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
import { RecipeCategory } from '@/types/recipe.types'
import { cn } from '@/lib/utils'
import { Button, btnClass } from '@/components/atoms/Button'

const categoryLabels: Record<RecipeCategory, string> = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle Yemeği',
  dinner: 'Akşam Yemeği',
  dessert: 'Tatlı',
  snack: 'Ara Sıcak',
  beverage: 'İçecek',
  vegetarian: 'Vejetaryen',
  vegan: 'Vegan',
  'gluten-free': 'Glutensiz',
}

const mainCategories: RecipeCategory[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack']

export default function RecipesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popular'>('newest')

  // TanStack Query ile tarifleri çek
  const { data, isLoading, error } = useRecipesQuery({
    page,
    pageSize: 20,
    search: search || undefined,
    categories: selectedCategory ? [selectedCategory] : undefined,
    sortBy,
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
    <main className="min-h-screen bg-gray-50">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Tarif Koleksiyonu</h1>
          <p className="text-gray-600 mb-6">
            {total} leziz tarifi keşfet ve hazırla
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tarif ara..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button type="submit">Ara</Button>
          </form>

          {/* Category Filter Chips */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">Kategoriler</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCategory(null); setPage(1) }}
                className={cn(btnClass, 'rounded-full px-4 py-2 text-sm', selectedCategory !== null && 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none')}
              >
                Tüm Kategoriler
              </button>
              {mainCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setPage(1) }}
                  className={cn(btnClass, 'rounded-full px-4 py-2 text-sm', selectedCategory !== category && 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none')}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-semibold text-gray-700">
              Sıralama:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'newest' | 'rating' | 'popular')
                setPage(1)
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            >
              <option value="newest">En Yeni</option>
              <option value="rating">En Yüksek Rating</option>
              <option value="popular">En Popüler</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-8">
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
            <p className="text-gray-600 text-lg mb-4">
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
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ← Önceki
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sayfa</span>
              <span className="font-bold text-gray-900">{page}</span>
              <span className="text-gray-600">/</span>
              <span className="font-bold text-gray-900">
                {Math.ceil(total / 20)}
              </span>
            </div>

            <Button onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
              Sonraki →
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
