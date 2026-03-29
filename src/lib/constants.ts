/**
 * Application constants
 *
 * Magic number'ları, enum'ları ve configuration values'ları burada tut
 * Centralized constants => easy maintenance
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  /** Base URL (environment'a göre değişir) */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  /** Request timeout (ms) */
  TIMEOUT: 10000,
  /** Token refresh endpoint */
  REFRESH_TOKEN_PATH: '/auth/refresh-token',
  /** Auth localStorage key */
  AUTH_TOKEN_KEY: 'auth-tokens',
  /** Refresh token localStorage key */
  REFRESH_TOKEN_KEY: 'refresh-token',
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  /** Default page size */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum page size */
  MAX_PAGE_SIZE: 100,
  /** First page number */
  FIRST_PAGE: 1,
} as const

/**
 * Search Configuration
 */
export const SEARCH_CONFIG = {
  /** Debounce delay (ms) */
  DEBOUNCE_DELAY: 300,
  /** Minimum search term length */
  MIN_SEARCH_LENGTH: 2,
  /** Maximum search results per query */
  MAX_RESULTS: 50,
} as const

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  /** Recipe list stale time (ms) */
  RECIPE_LIST_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  /** Recipe detail stale time (ms) */
  RECIPE_DETAIL_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  /** Recipe list GC time (ms) */
  RECIPE_LIST_GC_TIME: 10 * 60 * 1000, // 10 minutes
  /** Recipe detail GC time (ms) */
  RECIPE_DETAIL_GC_TIME: 30 * 60 * 1000, // 30 minutes
} as const

/**
 * Feature flags (A/B testing, feature toggles, vb)
 */
export const FEATURES = {
  /** Rating/review sistemi aktif mi */
  REVIEWS_ENABLED: true,
  /** Social sharing aktif mi */
  SOCIAL_SHARING_ENABLED: true,
  /** Recipe creation aktif mi */
  USER_CREATED_RECIPES_ENABLED: true,
} as const

/**
 * Routes (navigation)
 */
export const ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  RECIPE_DETAIL: (id: string) => `/recipes/${id}`,
  SEARCH: '/search',
  FAVORITES: '/favorites',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const

/**
 * UI / UX constants
 */
export const UI = {
  /** Skeleton animation duration (ms) */
  SKELETON_PULSE_DURATION: 2000,
  /** Button loading spinner size */
  BUTTON_SPINNER_SIZE: 16,
  /** Toast notification duration (ms) */
  TOAST_DURATION: 3000,
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You need to be logged in.',
  FORBIDDEN: 'You do not have permission to do this.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  RECIPE_ADDED_TO_FAVORITES: 'Recipe added to favorites!',
  RECIPE_REMOVED_FROM_FAVORITES: 'Recipe removed from favorites.',
  REVIEW_SUBMITTED: 'Your review has been submitted.',
  PROFILE_UPDATED: 'Profile updated successfully.',
} as const
