/**
 * Skeleton Loading Component
 *
 * Generic skeleton loader - loading state'i göstermek için
 * CSS animation ile pulse efekti
 * RecipeCard, images, text vb için kullanılabilir
 *
 * @example
 * <Skeleton className="h-12 w-full" />
 * <Skeleton className="h-4 w-1/2 mt-2" />
 */

import React from 'react'

interface SkeletonProps {
  /** Skeleton'ın CSS class'ları (tailwind) */
  className?: string
  /** Alt element count (multiple skeletons render et) */
  count?: number
}

/**
 * Reusable Skeleton component
 * Tailwind CSS animate-pulse kullanır
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = 'h-12 w-full', count = 1 }, ref) => {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
            aria-label="Loading..."
            // a11y: Loading state'i screen reader'lara bil
            role="status"
          />
        ))}
      </>
    )
  }
)

Skeleton.displayName = 'Skeleton'

/**
 * Convenience export
 */
export default Skeleton
