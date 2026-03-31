'use client'

import { useFavoritesQuery } from '@/services/query/recipe.queries'
import { RecipeCard } from '@/components/molecules/RecipeCard/RecipeCard'
import { RecipeCardSkeleton } from '@/components/molecules/RecipeCard/RecipeCardSkeleton'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'

export default function FavoritesPage() {
  const { isAuthenticated } = useAuthStore()
  const { data: favoritesData, isLoading } = useFavoritesQuery()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Favorileri görmek için giriş yapın
          </h1>
          <p className="text-gray-600 mb-6">
            Lütfen favorilerinizi görmek için giriş yapın
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    )
  }

  const favorites = favoritesData?.items || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Favorilerim</h1>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'tarif' : 'tarif'} kaydedildi
          </p>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
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
            <p className="text-xl text-gray-600 mb-4">Henüz favori tarifiniz yok</p>
            <p className="text-gray-500 mb-6">
              Kalp simgesine tıklayarak tarifleri favorilere ekleyin
            </p>
            <Link
              href="/recipes"
              className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
            >
              Tarifleri Gözat
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
