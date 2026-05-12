/**
 * Authentication API service — Django (SimpleJWT) backend ile konuşur
 *
 * Django response formatı: { user, access, refresh }
 * Frontend tip formatı: { user, tokens: { accessToken, refreshToken, expiresIn, tokenType } }
 * Aşağıdaki mapping fonksiyonları iki formatı eşleştirir.
 */

import { apiClient } from './axios.instance'
import {
  AuthResponse,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth.types'

interface DjangoAuthResponse {
  user: DjangoUser
  access: string
  refresh: string
}

interface DjangoUser {
  id: number | string
  email: string
  name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  date_joined?: string
  created_at?: string
  updated_at?: string
}

function mapUser(u: DjangoUser): User {
  const fullName = u.name ?? [u.first_name, u.last_name].filter(Boolean).join(' ').trim()
  return {
    id: String(u.id),
    email: u.email,
    name: fullName || u.email,
    avatarUrl: u.avatar_url,
    createdAt: u.created_at ?? u.date_joined ?? new Date().toISOString(),
    updatedAt: u.updated_at ?? u.date_joined ?? new Date().toISOString(),
  }
}

function mapTokens(access: string, refresh: string): AuthTokens {
  // SimpleJWT access token süresi settings.py'de 1 gün; client tarafta sadece bilgi amaçlı tut.
  return {
    accessToken: access,
    refreshToken: refresh,
    expiresIn: 60 * 60 * 24,
    tokenType: 'Bearer',
  }
}

function mapAuthResponse(data: DjangoAuthResponse): AuthResponse {
  return {
    user: mapUser(data.user),
    tokens: mapTokens(data.access, data.refresh),
  }
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<DjangoAuthResponse>('/auth/login/', credentials)
    return mapAuthResponse(response.data)
  }

  static async register(data: RegisterCredentials): Promise<AuthResponse> {
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
    }
    const response = await apiClient.post<DjangoAuthResponse>('/auth/register/', payload)
    return mapAuthResponse(response.data)
  }

  static async logout(refreshToken?: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout/', refreshToken ? { refresh: refreshToken } : {})
    } catch (error) {
      // Logout başarısız bile olsa local state'i temizleriz
      console.error('Logout error:', error)
    }
  }

  static async me(): Promise<User> {
    const response = await apiClient.get<DjangoUser>('/auth/me/')
    return mapUser(response.data)
  }

  static async updateMe(patch: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User> {
    const body: Record<string, unknown> = {}
    if (patch.name !== undefined) body.name = patch.name
    if (patch.avatarUrl !== undefined) body.avatar_url = patch.avatarUrl
    const response = await apiClient.patch<DjangoUser>('/auth/me/', body)
    return mapUser(response.data)
  }
}
