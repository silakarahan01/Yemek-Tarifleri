/**
 * MSW Request Handlers
 *
 * Mock API endpoints - development ve testing için
 * Production'da bu dosya yüklenmez
 */

import { http, HttpResponse } from 'msw'
import { MOCK_RECIPES, MOCK_RECIPE_ITEMS } from './data'
import { ApiResponse, PaginatedResponse } from '@/types/api.types'
import { Recipe, RecipeListItem } from '@/types/recipe.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

/**
 * Mock handlers
 */
export const handlers = [
  /**
   * GET /recipes - Tarif listesi (pagination + filtreleme)
   */
  http.get(`${API_BASE_URL}/recipes`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const search = url.searchParams.get('search')?.toLowerCase() || ''

    // Basit filtreleme
    let filtered = MOCK_RECIPE_ITEMS
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.id.includes(search)
      )
    }

    // Pagination
    const total = filtered.length
    const hasMore = page * pageSize < total
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)

    const response: ApiResponse<PaginatedResponse<RecipeListItem>> = {
      data: {
        items,
        total,
        page,
        pageSize,
        hasMore,
      },
      success: true,
      timestamp: Date.now(),
    }

    return HttpResponse.json(response)
  }),

  /**
   * GET /recipes/:id - Tek tarif detayı
   */
  http.get(`${API_BASE_URL}/recipes/:id`, ({ params }) => {
    const { id } = params
    const recipe = MOCK_RECIPES.find((r) => r.id === id)

    if (!recipe) {
      return HttpResponse.json(
        {
          code: 'NOT_FOUND',
          message: 'Recipe not found',
          statusCode: 404,
          timestamp: Date.now(),
        },
        { status: 404 }
      )
    }

    const response: ApiResponse<Recipe> = {
      data: recipe,
      success: true,
      timestamp: Date.now(),
    }

    return HttpResponse.json(response)
  }),

  /**
   * GET /recipes/search - Search endpoint
   */
  http.get(`${API_BASE_URL}/recipes/search`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase() || ''
    const limit = parseInt(url.searchParams.get('limit') || '20')

    const results = MOCK_RECIPE_ITEMS.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.id.includes(query)
    ).slice(0, limit)

    const response: ApiResponse<RecipeListItem[]> = {
      data: results,
      success: true,
      timestamp: Date.now(),
    }

    return HttpResponse.json(response)
  }),

  /**
   * GET /recipes/trending - Trending recipes
   */
  http.get(`${API_BASE_URL}/recipes/trending`, ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '12')

    // En çok favorilenenler
    const trending = [...MOCK_RECIPE_ITEMS]
      .sort((a, b) => b.favoriteCount - a.favoriteCount)
      .slice(0, limit)

    const response: ApiResponse<RecipeListItem[]> = {
      data: trending,
      success: true,
      timestamp: Date.now(),
    }

    return HttpResponse.json(response)
  }),

  /**
   * GET /categories/popular - Popular kategoriler
   */
  http.get(`${API_BASE_URL}/categories/popular`, () => {
    const response: ApiResponse<string[]> = {
      data: ['dinner', 'breakfast', 'dessert', 'vegetarian', 'quick'],
      success: true,
      timestamp: Date.now(),
    }

    return HttpResponse.json(response)
  }),

  /**
   * POST /recipes/:id/favorite - Favoriye ekle
   */
  http.post(`${API_BASE_URL}/recipes/:id/favorite`, ({ params }) => {
    const { id } = params
    const recipe = MOCK_RECIPES.find((r) => r.id === id)

    if (!recipe) {
      return HttpResponse.json(
        {
          code: 'NOT_FOUND',
          message: 'Recipe not found',
          statusCode: 404,
          timestamp: Date.now(),
        },
        { status: 404 }
      )
    }

    // Mock: favoriteCount'u 1 arttır
    recipe.favoriteCount += 1

    return HttpResponse.json({
      success: true,
      message: 'Added to favorites',
      timestamp: Date.now(),
    })
  }),

  /**
   * DELETE /recipes/:id/favorite - Favorilerden çıkar
   */
  http.delete(`${API_BASE_URL}/recipes/:id/favorite`, ({ params }) => {
    const { id } = params
    const recipe = MOCK_RECIPES.find((r) => r.id === id)

    if (!recipe) {
      return HttpResponse.json(
        {
          code: 'NOT_FOUND',
          message: 'Recipe not found',
          statusCode: 404,
          timestamp: Date.now(),
        },
        { status: 404 }
      )
    }

    // Mock: favoriteCount'u 1 azalt
    if (recipe.favoriteCount > 0) {
      recipe.favoriteCount -= 1
    }

    return HttpResponse.json({
      success: true,
      message: 'Removed from favorites',
      timestamp: Date.now(),
    })
  }),

  /**
   * GET /recipes/favorites - Kullanıcının favorileri
   */
  http.get(`${API_BASE_URL}/recipes/favorites`, () => {
    // Mock: first 2 recipes as favorites
    const favorites = MOCK_RECIPE_ITEMS.slice(0, 2)

    const response: ApiResponse<PaginatedResponse<RecipeListItem>> = {
      data: {
        items: favorites,
        total: favorites.length,
        page: 1,
        pageSize: 20,
        hasMore: false,
      },
      success: true,
      timestamp: Date.now(),
    }

    return HttpResponse.json(response)
  }),

  /**
   * POST /auth/login - Login
   */
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    // Mock: herhangi bir email/password kabul et
    if (!body.email || !body.password) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Email and password required',
          statusCode: 400,
          timestamp: Date.now(),
        },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      data: {
        user: {
          id: '123',
          email: body.email,
          name: body.email.split('@')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'mock-access-token-' + Math.random(),
          refreshToken: 'mock-refresh-token-' + Math.random(),
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      },
      success: true,
      timestamp: Date.now(),
    })
  }),

  /**
   * POST /auth/register - Register
   */
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string; name: string }

    if (!body.email || !body.password || !body.name) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Email, password, and name required',
          statusCode: 400,
          timestamp: Date.now(),
        },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      data: {
        user: {
          id: 'user-' + Math.random().toString(36).substring(7),
          email: body.email,
          name: body.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'mock-access-token-' + Math.random(),
          refreshToken: 'mock-refresh-token-' + Math.random(),
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      },
      success: true,
      timestamp: Date.now(),
    })
  }),

  /**
   * POST /auth/refresh-token - Token refresh
   */
  http.post(`${API_BASE_URL}/auth/refresh-token`, () => {
    return HttpResponse.json({
      data: {
        accessToken: 'mock-access-token-refreshed-' + Math.random(),
        expiresIn: 3600,
      },
      success: true,
      timestamp: Date.now(),
    })
  }),

  /**
   * POST /auth/logout - Logout
   */
  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
      timestamp: Date.now(),
    })
  }),
]
