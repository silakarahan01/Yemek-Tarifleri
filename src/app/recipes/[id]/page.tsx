'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRecipeDetailQuery } from '@/services/query/recipe.queries'
import { useFavorites } from '@/hooks/useFavorites'
import { Skeleton } from '@/components/atoms/Skeleton'
import { formatTime, formatDifficulty, formatServings } from '@/utils/formatters'
import { cn } from '@/lib/utils'

function RecipeDetailContent({ id }: { id: string }) {
  const { data: recipe } = useRecipeDetailQuery(id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())

  const toggleIngredient = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId)
    } else {
      newChecked.add(ingredientId)
    }
    setCheckedIngredients(newChecked)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-brand-500 hover:text-brand-600">
                Ana Sayfa
              </Link>
            </li>
            <li className="text-gray-600 dark:text-gray-400">/</li>
            <li>
              <Link href="/recipes" className="text-brand-500 hover:text-brand-600">
                Tarifler
              </Link>
            </li>
            <li className="text-gray-600 dark:text-gray-400">/</li>
            <li className="text-gray-900 dark:text-white font-medium truncate">{recipe.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay + Favorite Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
          <div className="w-full p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-3">{recipe.title}</h1>
                <p className="text-lg opacity-95">{recipe.description}</p>
              </div>
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className="ml-4 text-5xl hover:scale-110 transition-transform duration-200"
                aria-label={isFavorite(recipe.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              >
                {isFavorite(recipe.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">⏱️ Hazırlık Süresi</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(recipe.prepTimeMinutes)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">🔥 Pişirme Süresi</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(recipe.cookTimeMinutes)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">👥 Porsiyon</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatServings(recipe.servings)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📊 Zorluk</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDifficulty(recipe.difficulty)}
            </p>
          </div>
        </div>

        {/* Rating Card */}
        <div className="mb-8 card p-6 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-200 dark:border-brand-700">
          <div className="flex items-center space-x-4">
            <span className="text-5xl">⭐</span>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {recipe.rating.toFixed(1)} / 5
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {recipe.reviewCount} yorum • {recipe.favoriteCount} kişi favoriledi
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Ingredients */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">🥘 Malzemeler</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => toggleIngredient(ingredient.id)}
                  >
                    <input
                      type="checkbox"
                      checked={checkedIngredients.has(ingredient.id)}
                      onChange={() => toggleIngredient(ingredient.id)}
                      className="mt-1 mr-4 w-5 h-5 cursor-pointer accent-brand-500"
                      aria-label={`${ingredient.name} işaretле`}
                    />
                    <div className="flex-1">
                      <p
                        className={cn(
                          'font-medium transition-all',
                          checkedIngredients.has(ingredient.id)
                            ? 'line-through text-gray-500 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        )}
                      >
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </p>
                      {ingredient.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ingredient.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">👨‍🍳 Hazırlama Adımları</h2>
              <ol className="space-y-6">
                {recipe.instructions.map((instruction) => (
                  <li key={instruction.stepNumber} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-500 text-white font-bold text-lg">
                        {instruction.stepNumber}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
                        {instruction.instruction}
                      </p>
                      {instruction.durationMinutes && (
                        <p className="text-sm text-brand-600 dark:text-brand-400 mt-2 font-medium">
                          ⏱️ {instruction.durationMinutes} dakika
                        </p>
                      )}
                      {instruction.imageUrl && (
                        <div className="relative h-48 w-full mt-4 rounded-lg overflow-hidden">
                          <Image
                            src={instruction.imageUrl}
                            alt={`${instruction.stepNumber}. adım`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            {/* Nutrition Info */}
            {recipe.nutrition && (
              <section className="sticky top-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  🥗 Beslenme Bilgisi
                </h3>
                <div className="space-y-4">
                  <div className="card p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kalori</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.calories.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">kcal</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Protein</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.protein.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">g</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Karbonhidrat</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.carbs.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">g</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Yağ</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.fat.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">g</p>
                  </div>
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* Author Info */}
        {recipe.author && (
          <section className="mt-12 card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">👨‍🍳 Aşçı Hakkında</h3>
            <div className="flex items-center space-x-4">
              {recipe.author.avatarUrl && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={recipe.author.avatarUrl}
                    alt={recipe.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{recipe.author.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(recipe.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-12" />
        </div>
      }
    >
      <RecipeDetailContent id={params.id} />
    </Suspense>
  )
}
