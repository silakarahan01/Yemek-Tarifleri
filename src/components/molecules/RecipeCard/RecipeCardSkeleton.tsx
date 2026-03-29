/**
 * RecipeCardSkeleton - RecipeCard loading placeholder
 *
 * RecipeCard exact layout'una uyar
 * Smooth loading experience için skeleton component kulllan
 */

import React from 'react'
import { Skeleton } from '@/components/atoms/Skeleton'

export const RecipeCardSkeleton = React.memo(() => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton (2 lines) */}
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/2 mt-2" />

        {/* Meta skeleton */}
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Review count */}
        <Skeleton className="h-3 w-1/3 mt-3" />
      </div>
    </div>
  )
})

RecipeCardSkeleton.displayName = 'RecipeCardSkeleton'

export default RecipeCardSkeleton
