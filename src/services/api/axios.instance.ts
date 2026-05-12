/**
 * Axios instance'ı ve interceptor konfigürasyonu
 *
 * Responsibilities:
 * - Bearer token enjeksiyonu
 * - 401 durumunda refresh token mantığı (SimpleJWT formatı)
 * - Zentral error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ApiError, ApiErrorResponse } from '@/types/api.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const isBrowser = () => typeof window !== 'undefined'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor — her isteğe Bearer token inject et
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isBrowser()) {
      const tokens = localStorage.getItem('auth-tokens')
      if (tokens) {
        try {
          const { accessToken } = JSON.parse(tokens)
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
          }
        } catch {
          // Bozuk JSON — yok say
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor
 * - 401 → SimpleJWT refresh token endpoint'ini dene
 * - Diğer hataları ApiError'a normalize et
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // SSR'da localStorage yok → sadece error'ı normalize et
    if (
      isBrowser() &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const tokensRaw = localStorage.getItem('auth-tokens')
        if (!tokensRaw) {
          throw new Error('No refresh token available')
        }
        const tokens = JSON.parse(tokensRaw)
        const refreshToken = tokens.refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // SimpleJWT formatı: POST /auth/token/refresh/ { refresh: ... } → { access: ... }
        const response = await axios.post<{ access: string }>(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        )

        const newAccessToken = response.data.access

        localStorage.setItem(
          'auth-tokens',
          JSON.stringify({
            ...tokens,
            accessToken: newAccessToken,
          })
        )

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('auth-tokens')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(normalizeErrorResponse(error))
  }
)

function normalizeErrorResponse(error: AxiosError): ApiError {
  const statusCode = error.response?.status || 500
  const errorData = error.response?.data as ApiErrorResponse | undefined

  return new ApiError(
    statusCode,
    errorData?.code || 'UNKNOWN_ERROR',
    errorData?.message || error.message || 'An error occurred',
    errorData?.details
  )
}

export const createAbortSignal = () => new AbortController()
