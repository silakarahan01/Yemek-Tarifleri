/**
 * Recipe API service — adapted for Django REST Framework backend
 *
 * Django returns snake_case fields and DRF pagination format.
 * This service maps them to the frontend's camelCase types.
 */

import { apiClient } from './axios.instance'
import { Recipe, RecipeListItem, RecipeListParams, RecipeDifficulty, RecipeCategory } from '@/types/recipe.types'
import { PaginatedResponse } from '@/types/api.types'

// ─── Django response shapes ───────────────────────────────────────────────────

interface DjangoRecipeListItem {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  prep_time: number
  cook_time: number
  total_time: number
  servings: number
  image_url: string
  rating: string
  rating_count: number
  author_name: string
  created_at: string
}

interface DjangoIngredient {
  id: number
  name: string
  amount: string
}

interface DjangoInstruction {
  id: number
  step: number
  description: string
}

interface DjangoNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface DjangoRecipeDetail extends DjangoRecipeListItem {
  ingredients: DjangoIngredient[]
  instructions: DjangoInstruction[]
  nutrition: DjangoNutrition | null
}

interface DjangoPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapListItem(r: DjangoRecipeListItem): RecipeListItem {
  return {
    id: String(r.id),
    title: r.title,
    imageUrl: r.image_url,
    prepTimeMinutes: r.prep_time,
    cookTimeMinutes: r.cook_time,
    difficulty: (r.difficulty as RecipeDifficulty) || RecipeDifficulty.EASY,
    rating: parseFloat(r.rating) || 0,
    reviewCount: r.rating_count,
    favoriteCount: r.rating_count,
  }
}

function mapDetail(r: DjangoRecipeDetail): Recipe {
  return {
    id: String(r.id),
    title: r.title,
    description: r.description,
    prepTimeMinutes: r.prep_time,
    cookTimeMinutes: r.cook_time,
    servings: r.servings,
    difficulty: (r.difficulty as RecipeDifficulty) || RecipeDifficulty.EASY,
    categories: [r.category as RecipeCategory],
    imageUrl: r.image_url,
    rating: parseFloat(r.rating) || 0,
    reviewCount: r.rating_count,
    favoriteCount: r.rating_count,
    createdAt: r.created_at,
    updatedAt: r.created_at,
    author: { id: '1', name: r.author_name },
    ingredients: r.ingredients.map((ing) => ({
      id: String(ing.id),
      name: ing.name,
      amount: ing.amount,
      unit: '',
    })),
    instructions: r.instructions.map((ins) => ({
      stepNumber: ins.step,
      instruction: ins.description,
    })),
    nutrition: r.nutrition
      ? {
          calories: r.nutrition.calories,
          protein: r.nutrition.protein,
          carbs: r.nutrition.carbs,
          fat: r.nutrition.fat,
        }
      : undefined,
  }
}

function mapPaginated(
  django: DjangoPaginatedResponse<DjangoRecipeListItem>,
  page: number,
  pageSize: number
): PaginatedResponse<RecipeListItem> {
  return {
    items: django.results.map(mapListItem),
    total: django.count,
    page,
    pageSize,
    hasMore: django.next !== null,
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class RecipeService {
  static async getRecipes(params: RecipeListParams = {}): Promise<PaginatedResponse<RecipeListItem>> {
    const page = params.page || 1
    const pageSize = params.pageSize || 20

    const djangoParams: Record<string, string | number> = { page }
    if (params.search) djangoParams.q = params.search
    if (params.categories?.length) djangoParams.category = params.categories[0]
    if (params.sortBy === 'rating') djangoParams.sort = 'rating'
    else if (params.sortBy === 'popular') djangoParams.sort = 'popular'

    const response = await apiClient.get<DjangoPaginatedResponse<DjangoRecipeListItem>>(
      '/recipes/',
      { params: djangoParams }
    )
    return mapPaginated(response.data, page, pageSize)
  }

  static async getRecipeById(id: string): Promise<Recipe> {
    const response = await apiClient.get<DjangoRecipeDetail>(`/recipes/${id}/`)
    return mapDetail(response.data)
  }

  static async searchRecipes(query: string, limit: number = 10): Promise<RecipeListItem[]> {
    const response = await apiClient.get<DjangoPaginatedResponse<DjangoRecipeListItem>>(
      '/recipes/',
      { params: { q: query, page_size: limit } }
    )
    return response.data.results.map(mapListItem)
  }

  static async getTrendingRecipes(limit: number = 12): Promise<RecipeListItem[]> {
    const response = await apiClient.get<DjangoPaginatedResponse<DjangoRecipeListItem>>(
      '/recipes/',
      { params: { sort: 'popular', page_size: limit } }
    )
    return response.data.results.map(mapListItem)
  }

  static async getFavoriteRecipes(): Promise<PaginatedResponse<RecipeListItem>> {
    return { items: [], total: 0, page: 1, pageSize: 20, hasMore: false }
  }

  static async addFavorite(_recipeId: string): Promise<void> {}
  static async removeFavorite(_recipeId: string): Promise<void> {}
  static async addReview(_recipeId: string, _rating: number, _comment?: string): Promise<void> {}
  static async getPopularCategories(): Promise<string[]> { return [] }
}
