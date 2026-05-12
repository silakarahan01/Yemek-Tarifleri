/**
 * TanStack Query (React Query v5) için recipe endpoint'leri
 *
 * Responsibilities:
 * - Query keys factory (consistent naming)
 * - Query options (staleTime, gcTime, refetch behavior)
 * - Fetcher fonksiyonları
 * - Kullanıcı-facing hooks (useRecipesQuery, useRecipeDetailQuery)
 *
 * Stack:
 * - useSuspenseQuery: Suspense boundary ile birlikte
 * - useQuery: Normal query (fallback UI gereklidir)
 * - useMutation: Favorites add/remove
 */

'use client'

import { useSuspenseQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RecipeService, RecipeWritePayload } from '@/services/api/recipe.service'
import { RecipeListParams } from '@/types/recipe.types'

/**
 * Query keys factory
 * TanStack Query best practice: hiyerarşik key structure
 */
export const recipeQueryKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeQueryKeys.all, 'list'] as const,
  list: (filters: RecipeListParams) =>
    [...recipeQueryKeys.lists(), { ...filters }] as const,
  details: () => [...recipeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeQueryKeys.details(), id] as const,
  search: () => [...recipeQueryKeys.all, 'search'] as const,
  searchQuery: (query: string) =>
    [...recipeQueryKeys.search(), { q: query }] as const,
  favorites: () => [...recipeQueryKeys.all, 'favorites'] as const,
  trending: () => [...recipeQueryKeys.all, 'trending'] as const,
}

/**
 * Query default options
 * Tüm recipe queries bunları inherit edecek
 */
export const recipeQueryOptions = {
  // Liste ne kadar süre fresh kabul edilecek (5 dakika)
  staleTime: 5 * 60 * 1000,
  // GC time (inactive query'leri temizle) — 10 dakika
  gcTime: 10 * 60 * 1000,
  // Network'e geri gelince refetch yapmayacak (user window focus)
  refetchOnWindowFocus: false,
  // Poll yapmayacak
  refetchInterval: false,
} as const

/**
 * useRecipesQuery - Paginated recipe list
 *
 * @example
 * const { data, isLoading, error } = useRecipesQuery({
 *   search: 'pasta',
 *   sortBy: 'newest'
 * })
 */
export function useRecipesQuery(params: RecipeListParams = {}) {
  return useQuery({
    queryKey: recipeQueryKeys.list(params),
    queryFn: () => RecipeService.getRecipes(params),
    ...recipeQueryOptions,
  })
}

/**
 * useRecipeDetailQuery - Tek tarif (Suspense ile)
 *
 * Suspense boundary'ye ihtiyaç var:
 * @example
 * <Suspense fallback={<RecipeDetailSkeleton />}>
 *   <RecipeDetail id="recipe-123" />
 * </Suspense>
 */
export function useRecipeDetailQuery(id: string) {
  return useSuspenseQuery({
    queryKey: recipeQueryKeys.detail(id),
    queryFn: () => RecipeService.getRecipeById(id),
    staleTime: 15 * 60 * 1000, // 15 dakika stale
    gcTime: 30 * 60 * 1000, // 30 dakika GC
  })
}

/**
 * useRecipeDetailQueryOptional - Suspense olmadan
 * (opsiyonel veri için)
 */
export function useRecipeDetailQueryOptional(id: string) {
  return useQuery({
    queryKey: recipeQueryKeys.detail(id),
    queryFn: () => RecipeService.getRecipeById(id),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * useSearchRecipesQuery - Search endpoint'i
 */
export function useSearchRecipesQuery(query: string, enabled = true) {
  return useQuery({
    queryKey: recipeQueryKeys.searchQuery(query),
    queryFn: () => RecipeService.searchRecipes(query, 20),
    enabled: enabled && query.length >= 2, // Minimum 2 char
    ...recipeQueryOptions,
  })
}

/**
 * useTrendingRecipesQuery - Trending recipes
 */
export function useTrendingRecipesQuery() {
  return useQuery({
    queryKey: recipeQueryKeys.trending(),
    queryFn: () => RecipeService.getTrendingRecipes(12),
    staleTime: 30 * 60 * 1000, // 30 dakika (trending daha az değişir)
    gcTime: 60 * 60 * 1000, // 1 saat
  })
}

/**
 * useFavoritesQuery - Kullanıcının favorileri
 * Authenticated query
 */
export function useFavoritesQuery() {
  return useQuery({
    queryKey: recipeQueryKeys.favorites(),
    queryFn: () => RecipeService.getFavoriteRecipes(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * useAddFavoriteMutation - Favoriye ekle mutation
 * Optimistic update pattern ile
 */
export function useAddFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (recipeId: string) => RecipeService.toggleFavorite(recipeId),
    // Optimistic update
    onMutate: async (_recipeId: string) => {
      // Pending favorileri iptal et
      await queryClient.cancelQueries({
        queryKey: recipeQueryKeys.all,
      })

      // Eski data'yı backup et
      const previousFavorites = queryClient.getQueryData(
        recipeQueryKeys.favorites()
      )

      return { previousFavorites }
    },
    onError: (_error, _recipeId, context) => {
      // Rollback: eski data'yı restore et
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          recipeQueryKeys.favorites(),
          context.previousFavorites
        )
      }
    },
    // Server'dan sonuç gelince refetch et (yeni state'i senkronla)
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recipeQueryKeys.favorites(),
      })
    },
  })
}

/**
 * useMyRecipesQuery - Kullanıcının kendi tarifleri (profil sayfası için)
 */
export function useMyRecipesQuery(enabled = true) {
  return useQuery({
    queryKey: [...recipeQueryKeys.all, 'mine'] as const,
    queryFn: () => RecipeService.getMyRecipes(),
    enabled,
    staleTime: 60 * 1000,
  })
}

/**
 * useCreateRecipeMutation - Yeni tarif oluştur
 */
export function useCreateRecipeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecipeWritePayload) => RecipeService.createRecipe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.all })
    },
  })
}

/**
 * useUpdateRecipeMutation - Tarif düzenle
 */
export function useUpdateRecipeMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecipeWritePayload) => RecipeService.updateRecipe(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.lists() })
    },
  })
}

/**
 * useDeleteRecipeMutation - Tarif sil
 */
export function useDeleteRecipeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => RecipeService.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.all })
    },
  })
}

/**
 * useRemoveFavoriteMutation - Favorilerden çıkar mutation
 */
export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (recipeId: string) => RecipeService.removeFavorite(recipeId),
    onMutate: async (_recipeId: string) => {
      await queryClient.cancelQueries({
        queryKey: recipeQueryKeys.all,
      })

      const previousFavorites = queryClient.getQueryData(
        recipeQueryKeys.favorites()
      )

      return { previousFavorites }
    },
    onError: (_error, _recipeId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          recipeQueryKeys.favorites(),
          context.previousFavorites
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recipeQueryKeys.favorites(),
      })
    },
  })
}
