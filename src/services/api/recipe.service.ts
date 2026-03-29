/**
 * Recipe API service sınıfı
 *
 * Tüm recipe ile ilgili API istekleri bu sınıfta tanımlanır
 * Axios instance'ı ve types kullanarak type-safe istekler yapar
 */

import { apiClient } from './axios.instance'
import { Recipe, RecipeListItem, RecipeListParams } from '@/types/recipe.types'
import { ApiResponse, PaginatedResponse } from '@/types/api.types'

/**
 * Recipe API service
 * Static methods ile organize edilir (DI gerekli değil)
 */
export class RecipeService {
  /**
   * Tüm tarifleri liste olarak al (pagination + filtreleme ile)
   *
   * Query parameters:
   * - page: sayfa numarası (1-indexed)
   * - pageSize: sayfa başına kaç tarif
   * - search: arama sorgusu (title/description'da)
   * - categories: kategoriler (array)
   * - difficulty: zorluk seviyesi
   * - sortBy: sıralama türü
   *
   * @example
   * const recipes = await RecipeService.getRecipes({
   *   search: 'pasta',
   *   categories: ['dinner'],
   *   sortBy: 'newest'
   * })
   */
  static async getRecipes(
    params?: RecipeListParams
  ): Promise<PaginatedResponse<RecipeListItem>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<RecipeListItem>>
    >('/recipes', { params })

    return response.data.data
  }

  /**
   * Tek bir tarifi ID ile al
   * Detaylı bilgiler içerir (ingredients, instructions, nutrition, vb)
   *
   * @param id - Tarif ID'si
   * @example
   * const recipe = await RecipeService.getRecipeById('recipe-123')
   */
  static async getRecipeById(id: string): Promise<Recipe> {
    const response = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`)
    return response.data.data
  }

  /**
   * Search endpoint'i (getRecipes'e alternatif, optimize search için)
   * Backend'de text search indexing yapılıyorsa bu daha hızlı olur
   *
   * @param query - Arama metni
   * @param limit - Kaç sonuç dönecek (autocomplete için)
   */
  static async searchRecipes(
    query: string,
    limit: number = 10
  ): Promise<RecipeListItem[]> {
    const response = await apiClient.get<ApiResponse<RecipeListItem[]>>(
      '/recipes/search',
      {
        params: { q: query, limit },
      }
    )
    return response.data.data
  }

  /**
   * Favoriye eklenmiş tarifleri al
   * Authenticated request - token gerekli
   *
   * @param userId - Kullanıcı ID'si (opsiyonel, current user varsayılan)
   */
  static async getFavoriteRecipes(
    userId?: string
  ): Promise<PaginatedResponse<RecipeListItem>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<RecipeListItem>>
    >('/recipes/favorites', {
      params: userId ? { userId } : undefined,
    })
    return response.data.data
  }

  /**
   * Tarifi favorilere ekle
   * İdempotent: aynı tarifi iki kez eklemek safe
   *
   * @param recipeId - Tarif ID'si
   */
  static async addFavorite(recipeId: string): Promise<void> {
    await apiClient.post(`/recipes/${recipeId}/favorite`)
  }

  /**
   * Tarifi favorilerden çıkar
   *
   * @param recipeId - Tarif ID'si
   */
  static async removeFavorite(recipeId: string): Promise<void> {
    await apiClient.delete(`/recipes/${recipeId}/favorite`)
  }

  /**
   * Tarif için yorum/rating ekle
   *
   * @param recipeId - Tarif ID'si
   * @param rating - 1-5 arası puan
   * @param comment - Opsiyonel yorum metni
   */
  static async addReview(
    recipeId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    await apiClient.post(`/recipes/${recipeId}/reviews`, {
      rating,
      comment,
    })
  }

  /**
   * Trending tarifleri al
   * Homepage'de kullanılacak
   */
  static async getTrendingRecipes(limit: number = 12): Promise<RecipeListItem[]> {
    const response = await apiClient.get<ApiResponse<RecipeListItem[]>>(
      '/recipes/trending',
      {
        params: { limit },
      }
    )
    return response.data.data
  }

  /**
   * Yaklaşan/trending kategorileri al
   * Sidebar filter'leri doldirmak için
   */
  static async getPopularCategories(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      '/categories/popular'
    )
    return response.data.data
  }
}
