/**
 * RecipeCard Component - Reusable recipe card
 *
 * Features:
 * - Skeleton loading state (isLoading prop)
 * - Favorite button with optimistic update
 * - Next/Image lazy loading
 * - Recipe metadata (time, difficulty, rating)
 * - Fully typed props (no any)
 * - a11y: semantic HTML, ARIA attributes
 * - Hover effects ve animations
 *
 * @example
 * <RecipeCard
 *   recipe={recipe}
 *   isLoading={false}
 *   onFavoriteClick={() => {}}
 * />
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RecipeListItem, RecipeDifficulty } from '@/types/recipe.types'
import { RecipeCardSkeleton } from './RecipeCardSkeleton'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  /** Recipe veri */
  recipe: RecipeListItem
  /** Loading state - true ise Skeleton render et */
  isLoading?: boolean
  /** Favoriye ekle callback */
  onFavoriteClick?: (recipeId: string) => Promise<void>
  /** Favorilerde mi */
  isFavorite?: boolean
  /** Click event'i (card click'lenmişse) */
  onClick?: (recipeId: string) => void
}

/**
 * Zorluk seviyesini renklendir
 */
const getDifficultyColor = (difficulty: RecipeDifficulty): string => {
  switch (difficulty) {
    case RecipeDifficulty.EASY:
      return 'bg-green-100 text-green-800'
    case RecipeDifficulty.MEDIUM:
      return 'bg-yellow-100 text-yellow-800'
    case RecipeDifficulty.HARD:
      return 'bg-red-100 text-red-800'
  }
}

/**
 * Zorluk seviyesini label'a dönüştür (Türkçe)
 */
const getDifficultyLabel = (difficulty: RecipeDifficulty): string => {
  const labels: Record<RecipeDifficulty, string> = {
    [RecipeDifficulty.EASY]: 'Kolay',
    [RecipeDifficulty.MEDIUM]: 'Orta',
    [RecipeDifficulty.HARD]: 'Zor',
  }
  return labels[difficulty]
}

/**
 * RecipeCard component
 */
export const RecipeCard = React.memo<RecipeCardProps>(
  ({
    recipe,
    isLoading = false,
    isFavorite = false,
    onFavoriteClick,
    onClick,
  }) => {
    // Skeleton render et
    if (isLoading) {
      return <RecipeCardSkeleton />
    }

    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes
    const difficultyColor = getDifficultyColor(recipe.difficulty)
    const difficultyLabel = getDifficultyLabel(recipe.difficulty)

    const handleFavoriteClick = async (e: React.MouseEvent) => {
      // Link click'ını engelle
      e.preventDefault()
      e.stopPropagation()

      if (onFavoriteClick) {
        await onFavoriteClick(recipe.id)
      }
    }

    const handleCardClick = () => {
      if (onClick) {
        onClick(recipe.id)
      }
    }

    return (
      <article
        className={cn(
          'card cursor-pointer animate-fadeIn',
          'hover:shadow-lg'
        )}
        onClick={handleCardClick}
        role="article"
        aria-label={`Recipe: ${recipe.title}`}
      >
        {/* Image Container */}
        <div className="relative h-48 bg-gray-200 overflow-hidden group">
          <Link href={`/recipes/${recipe.id}`} className="block w-full h-full">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = '/images/placeholder.jpg'
              }}
            />
          </Link>

          {/* Difficulty Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-full',
                difficultyColor
              )}
              role="status"
            >
              {difficultyLabel}
            </span>
          </div>

          {/* Favorite Button - Top Left */}
          <button
            onClick={handleFavoriteClick}
            disabled={!onFavoriteClick}
            className={cn(
              'absolute top-3 left-3 p-2 rounded-full',
              'bg-white/90 backdrop-blur-sm',
              'hover:bg-white',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
            aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            aria-pressed={isFavorite}
            title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <span className="text-xl" aria-hidden="true">
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className={cn(
              'font-bold text-lg text-gray-900 line-clamp-2',
              'hover:text-brand-600 transition-colors'
            )}>
              {recipe.title}
            </h3>
          </Link>

          {/* Meta Info */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              {/* Total Time */}
              <div className="flex items-center" aria-label={`Total time: ${totalTime} minutes`}>
                <span className="mr-1">⏱️</span>
                <span>{totalTime} min</span>
              </div>

              {/* Rating */}
              <div className="flex items-center" aria-label={`Rating: ${recipe.rating} out of 5 stars`}>
                <span className="mr-1">⭐</span>
                <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Favorite Count */}
            <div className="text-xs" aria-label={`${recipe.favoriteCount} people favorited this`}>
              ❤️ {recipe.favoriteCount}
            </div>
          </div>

          {/* Review Count */}
          <p className="mt-2 text-xs text-gray-500">
            {recipe.reviewCount} {recipe.reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </article>
    )
  }
)

RecipeCard.displayName = 'RecipeCard'

export default RecipeCard
