/**
 * useSearch - Recipe search hook
 *
 * Responsibilities:
 * - Debounced search input
 * - URL query params senkronizasyonu
 * - API isteklerini TanStack Query ile yapma
 * - Gereksiz API çağrılarını engelleme
 *
 * @example
 * const { query, setQuery, recipes, isLoading } = useSearch()
 *
 * return (
 *   <>
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="Tarif ara..."
 *     />
 *     {isLoading && <Spinner />}
 *     {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
 *   </>
 * )
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebounce } from './useDebounce'
import { RecipeService } from '@/services/api/recipe.service'
import { RecipeListItem } from '@/types/recipe.types'

interface UseSearchOptions {
  /**Debounce delay (ms) */
  debounceDelay?: number
  /** Minimum search term length (kısaysa arama yapma) */
  minLength?: number
}

interface UseSearchReturn {
  /** Gerçek-time input value */
  query: string
  /** Setquery state'i */
  setQuery: (query: string) => void
  /** Debounced search sonuçları */
  recipes: RecipeListItem[]
  /** Request işleniyor mu */
  isLoading: boolean
  /** Hata varsa */
  error: string | null
  /** Total sonuç sayısı */
  totalResults: number
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceDelay = 300, minLength = 2 } = options

  const searchParams = useSearchParams()
  const router = useRouter()

  // State
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [recipes, setRecipes] = useState<RecipeListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  // Debounce search query
  const debouncedQuery = useDebounce(query, debounceDelay)

  /**
   * Query param'ları güncelle (URL'yi değiştir)
   * Bu sayede sayfayı yeniledikten sonra arama state'i restore olur
   */
  const updateQueryParam = useCallback(
    (newQuery: string) => {
      const params = new URLSearchParams(searchParams)
      if (newQuery) {
        params.set('q', newQuery)
      } else {
        params.delete('q')
      }
      router.push(`/search?${params.toString()}`)
    },
    [searchParams, router]
  )

  /**
   * Debounced query'ye reaktif olarak API isteklerini yap
   */
  useEffect(() => {
    // Minimum length kontrol et
    if (debouncedQuery.length < minLength) {
      setRecipes([])
      setTotalResults(0)
      setError(null)
      return
    }

    // API isteğini yap
    const fetchRecipes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const results = await RecipeService.searchRecipes(
          debouncedQuery,
          20 // Limit
        )
        setRecipes(results)
        setTotalResults(results.length)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Search failed'
        setError(errorMsg)
        setRecipes([])
        setTotalResults(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [debouncedQuery, minLength])

  /**
   * Query'i setlerken URL'ı de güncelle
   */
  const handleSetQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      updateQueryParam(newQuery)
    },
    [updateQueryParam]
  )

  return {
    query,
    setQuery: handleSetQuery,
    recipes,
    isLoading,
    error,
    totalResults,
  }
}
