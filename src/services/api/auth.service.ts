/**
 * Authentication API service
 * Login, register, logout, refresh token endpoints
 */

import { apiClient } from './axios.instance'
import { ApiResponse } from '@/types/api.types'
import { AuthResponse, RefreshTokenResponse, LoginCredentials, RegisterCredentials } from '@/types/auth.types'

export class AuthService {
  /**
   * Login kullanıcı
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data.data
  }

  /**
   * Register yeni kullanıcı
   */
  static async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token', {
      refreshToken,
    })
    return response.data.data
  }

  /**
   * Logout (sunucu-side cleanup)
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Logout başarısız bile olsa local state'i temizleriz
      console.error('Logout error:', error)
    }
  }
}
