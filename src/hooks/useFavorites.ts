/**
 * useFavorites - Favorit yönetimi hook'u
 *
 * Responsibilities:
 * - Zustand store'dan favorit state'i al
 * - Backend'e API isteği yap (async)
 * - Optimistic updates: önce local state'i güncelle, sonra backend'e ilet
 * - Error handling ve rollback
 *
 * @example
 * const { isFavorite, toggleFavorite, isLoading } = useFavorites()
 *
 * return (
 *   <button
 *     onClick={() => toggleFavorite('recipe-123')}
 *     disabled={isLoading}
 *   >
 *     {isFavorite('recipe-123') ? '♥️ Favorilerde' : '♡ Favoriye Ekle'}
 *   </button>
 * )
 */

'use client'

import { useState, useCallback } from 'react'
import { useFavoritesStore } from '@/store/favorites.store'
import { RecipeService } from '@/services/api/recipe.service'

interface UseFavoritesReturn {
  /** Tarif favorilerde mi */
  isFavorite: (recipeId: string) => boolean
  /** Favoriye ekle/çıkar (async) */
  toggleFavorite: (recipeId: string) => Promise<void>
  /** Favoriye ekle (async) */
  addFavorite: (recipeId: string) => Promise<void>
  /** Favorilerden çıkar (async) */
  removeFavorite: (recipeId: string) => Promise<void>
  /** Request işleniyor mu */
  isLoading: boolean
  /** Son hata */
  error: string | null
}

export function useFavorites(): UseFavoritesReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Zustand store'dan fonksiyonları al
  const { isFavorite, addFavorite: storeAddFavorite, removeFavorite: storeRemoveFavorite } =
    useFavoritesStore()

  /**
   * Favoriye ekle (optimistic)
   */
  const handleAddFavorite = useCallback(
    async (recipeId: string) => {
      // Zaten favorilerde mi kontrol et
      if (isFavorite(recipeId)) return

      setError(null)
      setIsLoading(true)

      try {
        // 1. Optimistic: Local state'i hemen güncelle
        storeAddFavorite(recipeId)

        // 2. Backend'e ilet
        await RecipeService.addFavorite(recipeId)
      } catch (err) {
        // 3. Hata varsa rollback
        const errorMsg = err instanceof Error ? err.message : 'Failed to add favorite'
        setError(errorMsg)
        storeRemoveFavorite(recipeId)
      } finally {
        setIsLoading(false)
      }
    },
    [isFavorite, storeAddFavorite, storeRemoveFavorite]
  )

  /**
   * Favorilerden çıkar (optimistic)
   */
  const handleRemoveFavorite = useCallback(
    async (recipeId: string) => {
      // Zaten favorilerde değil mi kontrol et
      if (!isFavorite(recipeId)) return

      setError(null)
      setIsLoading(true)

      try {
        // 1. Optimistic: Local state'i hemen güncelle
        storeRemoveFavorite(recipeId)

        // 2. Backend'e ilet
        await RecipeService.removeFavorite(recipeId)
      } catch (err) {
        // 3. Hata varsa rollback
        const errorMsg = err instanceof Error ? err.message : 'Failed to remove favorite'
        setError(errorMsg)
        storeAddFavorite(recipeId)
      } finally {
        setIsLoading(false)
      }
    },
    [isFavorite, storeAddFavorite, storeRemoveFavorite]
  )

  /**
   * Toggle: favorilerde ise çıkar, değilse ekle
   */
  const handleToggleFavorite = useCallback(
    async (recipeId: string) => {
      if (isFavorite(recipeId)) {
        await handleRemoveFavorite(recipeId)
      } else {
        await handleAddFavorite(recipeId)
      }
    },
    [isFavorite, handleAddFavorite, handleRemoveFavorite]
  )

  return {
    isFavorite,
    toggleFavorite: handleToggleFavorite,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    isLoading,
    error,
  }
}
