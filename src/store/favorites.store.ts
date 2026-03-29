/**
 * Zustand favorites store
 *
 * Responsibilities:
 * - Favoriye eklenmiş tarif ID'lerini Set olarak tutma (O(1) lookup)
 * - Add/remove favorite actions
 * - localStorage persistence
 * - isFavorite computed selector
 *
 * Bu store, TanStack Query'nin mutations'ları ile beraber çalışır
 * Optimistic updates için önce burada state'i güncelle, sonra backend'e ilet
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Favorites store state'i
 * Set kullanmak, id'den isFavorite check'ini O(1) yapar
 */
interface FavoritesState {
  /** Favoriye eklenmiş tarif ID'leri (Set for O(1) lookup) */
  favoriteIds: Set<string>

  /** Kaç tarif favorilere eklendi (UI için) */
  count: number
}

interface FavoritesActions {
  /** Tarifi favorilere ekle (idempotent) */
  addFavorite: (recipeId: string) => void

  /** Tarifi favorilerden çıkar */
  removeFavorite: (recipeId: string) => void

  /** Favorit olup olmadığını kontrol et */
  isFavorite: (recipeId: string) => boolean

  /** Favoriteleri batch olarak ayarla (sync için) */
  setFavorites: (ids: string[]) => void

  /** Tüm favorileri temizle */
  clear: () => void
}

type FavoritesStore = FavoritesState & FavoritesActions

// localStorage'dan state'i restore ederken favoriteIds array'den Set'e dönüştürmek lazım
// Zustand partialize middleware bunu handle ediyor

/**
 * Zustand favorites store
 */
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      // State
      favoriteIds: new Set<string>(),
      count: 0,

      // Actions
      addFavorite: (recipeId: string) =>
        set((state) => {
          const newIds = new Set(state.favoriteIds)
          const isNew = !newIds.has(recipeId)

          newIds.add(recipeId)

          return {
            favoriteIds: newIds,
            count: state.count + (isNew ? 1 : 0),
          }
        }),

      removeFavorite: (recipeId: string) =>
        set((state) => {
          const newIds = new Set(state.favoriteIds)
          const existed = newIds.has(recipeId)

          newIds.delete(recipeId)

          return {
            favoriteIds: newIds,
            count: state.count - (existed ? 1 : 0),
          }
        }),

      isFavorite: (recipeId: string) => {
        return get().favoriteIds.has(recipeId)
      },

      setFavorites: (ids: string[]) =>
        set({
          favoriteIds: new Set(ids),
          count: ids.length,
        }),

      clear: () =>
        set({
          favoriteIds: new Set<string>(),
          count: 0,
        }),
    }),
    {
      name: 'favorites-store',
      partialize: (state) => ({
        favoriteIds: Array.from(state.favoriteIds),
        count: state.count,
      }),
    }
  )
)

/**
 * Computed selector: Favorit olup olmadığını kontrol et
 *
 * @example
 * const isFav = useFavoritesStore((s) => s.isFavorite('recipe-123'))
 */
export const useIsFavorite = (recipeId: string) => {
  return useFavoritesStore((state) => state.isFavorite(recipeId))
}

/**
 * Computed selector: Favorit sayısı
 */
export const useFavoritesCount = () => {
  return useFavoritesStore((state) => state.count)
}
