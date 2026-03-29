/**
 * Axios instance'ı ve interceptor konfigürasyonu
 *
 * Responsibilities:
 * - Bearer token enjeksiyonu
 * - 401 durumunda refresh token mantığı
 * - Zentral error handling
 * - API yanıtları normalize etme
 *
 * Development'ta MSW (Mock Service Worker) ile çalışır
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ApiError, ApiErrorResponse } from '@/types/api.types'
import { RefreshTokenResponse } from '@/types/auth.types'

// TODO: .env dosyasından okumak
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

/**
 * Development'ta MSW server'ı başlat
 * Browser'de istekler MSW tarafından intercept edilir
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Browser environment'ında çalışır
  // MSW browser worker otomatik başlatılacak
}

/**
 * Axios instance oluştur
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor
 * Her isteğe Bearer token'ı inject et
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand store'dan token al
    // Store'u import etmek circular dependency'e neden olabilir,
    // bu yüzden localStorage'dan doğrudan oku (production'da secure cookie tercih edilir)
    const tokens = localStorage.getItem('auth-tokens')
    if (tokens) {
      const { accessToken } = JSON.parse(tokens)
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * - ApiError'a normalize et
 * - 401 hatası ise refresh token yapmayı dene
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 Unauthorized ve daha önce retry yapmadıysa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Token'ı refresh et
        const refreshToken = localStorage.getItem('refresh-token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        )

        const { accessToken, expiresIn } = response.data

        // localStorage'da token güncelle
        const tokens = JSON.parse(localStorage.getItem('auth-tokens') || '{}')
        localStorage.setItem(
          'auth-tokens',
          JSON.stringify({
            ...tokens,
            accessToken,
            expiresIn,
          })
        )

        // Orijinal isteği yeni token ile tekrar dene
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh token başarısız, kullanıcıyı logout et
        localStorage.removeItem('auth-tokens')
        localStorage.removeItem('refresh-token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // ApiError'a dönüştür
    const apiError = normalizeErrorResponse(error)
    return Promise.reject(apiError)
  }
)

/**
 * Axios error'u ApiError'a normalize et
 */
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

/**
 * Utility: request'i cancel et (cleanup için)
 * Örn: useEffect cleanup'ında
 */
export const createAbortSignal = () => {
  return new AbortController()
}
