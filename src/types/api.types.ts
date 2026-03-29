/**
 * Merkezi API type tanımları
 * Tüm backend istekleri ve yanıtları bu types üzerinden geçer
 */

/**
 * Standart API yanıt wrapper
 * Her backend yanıtı bu yapıyı takip eder
 */
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  timestamp: number
}

/**
 * Paginated API response untuk liste endpoint'leri
 */
export interface PaginatedResponse<T = unknown> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * API hatası standart tanımı
 * Axios interceptor tarafından normalize edilir
 */
export interface ApiErrorResponse {
  code: string
  message: string
  statusCode: number
  details?: Record<string, unknown>
  timestamp: number
}

/**
 * Merkezi ApiError sınıfı
 * Tüm API hataları bu şekilde cast edilir
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  }
}

/**
 * Request/Response interceptor payload types
 */
export interface RequestConfig {
  headers: Record<string, string>
  data?: unknown
  params?: Record<string, unknown>
}

export interface ResponseData<T> {
  status: number
  data: T
  headers: Record<string, string>
}
