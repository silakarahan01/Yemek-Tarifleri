/**
 * Authentication ve User types
 */

/**
 * Kullanıcı bilgisi
 */
export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

/**
 * Auth tokenleri (JWT pattern)
 */
export interface AuthTokens {
  /** Access token (kısa ömürlü, isteklerde kullanılır) */
  accessToken: string
  /** Refresh token (uzun ömürlü, yeni access token almak için) */
  refreshToken: string
  /** Token'ın ne zaman expire olacağı (Unix timestamp) */
  expiresIn: number
  /** Token type (genellikle "Bearer") */
  tokenType: string
}

/**
 * Login/Register request payload'ları
 */
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  /** Şartları kabul etti mi */
  acceptTerms: boolean
}

/**
 * Auth endpoint response'ları
 */
export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

/**
 * Refresh token endpoint yanıtı
 */
export interface RefreshTokenResponse {
  accessToken: string
  expiresIn: number
}

/**
 * Zustand auth store'da tutulan state
 */
export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Auth store actions
 */
export interface AuthActions {
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  reset: () => void
}

/**
 * Token payload'u (JWT decode sonucu)
 */
export interface TokenPayload {
  sub: string
  email: string
  iat: number
  exp: number
}
