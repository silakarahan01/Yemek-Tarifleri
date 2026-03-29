'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useRecipeDetailQuery } from '@/services/query/recipe.queries'
import { useFavorites } from '@/hooks/useFavorites'
import { Skeleton } from '@/components/atoms/Skeleton'
import { formatTime, formatDifficulty, formatServings } from '@/utils/formatters'

function RecipeDetailContent({ id }: { id: string }) {
  const { data: recipe } = useRecipeDetailQuery(id)
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
          <div className="w-full p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
                <p className="text-lg opacity-90">{recipe.description}</p>
              </div>
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className="ml-4 text-4xl hover:scale-110 transition-transform"
                aria-label={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite(recipe.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">⏱️ Prep Time</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(recipe.prepTimeMinutes)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">🔥 Cook Time</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(recipe.cookTimeMinutes)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">👥 Servings</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatServings(recipe.servings)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">📊 Difficulty</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatDifficulty(recipe.difficulty)}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">⭐</span>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {recipe.rating.toFixed(1)} / 5
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ({recipe.reviewCount} reviews) • {recipe.favoriteCount} favorites
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Ingredients */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 mr-4 w-5 h-5 cursor-pointer"
                      aria-label={`Check off ${ingredient.name}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </p>
                      {ingredient.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{ingredient.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction) => (
                  <li key={instruction.stepNumber} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-500 text-white font-bold">
                        {instruction.stepNumber}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-lg">
                        {instruction.instruction}
                      </p>
                      {instruction.durationMinutes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          ⏱️ ~{instruction.durationMinutes} minutes
                        </p>
                      )}
                      {instruction.imageUrl && (
                        <div className="relative h-48 w-full mt-3 rounded-lg overflow-hidden">
                          <Image
                            src={instruction.imageUrl}
                            alt={`Step ${instruction.stepNumber}`}
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
                  Nutrition (per serving)
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.calories.toFixed(0)} kcal
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.protein.toFixed(1)}g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Carbs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.carbs.toFixed(1)}g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.nutrition.fat.toFixed(1)}g
                    </p>
                  </div>
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* Author Info */}
        {recipe.author && (
          <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">About the Chef</h3>
            <div className="flex items-center space-x-4">
              {recipe.author.avatarUrl && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
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
                  Posted on {new Date(recipe.createdAt).toLocaleDateString()}
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
