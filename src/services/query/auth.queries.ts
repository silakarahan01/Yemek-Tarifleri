'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/services/api/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth.types'

/**
 * Query keys for auth
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  login: () => [...authQueryKeys.all, 'login'] as const,
  register: () => [...authQueryKeys.all, 'register'] as const,
  logout: () => [...authQueryKeys.all, 'logout'] as const,
}

/**
 * useLoginMutation - Login user
 */
export function useLoginMutation() {
  const queryClient = useQueryClient()
  const { setUser, setTokens, setIsLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return AuthService.login(credentials)
    },
    onMutate: () => {
      setIsLoading(true)
      setError(null)
    },
    onSuccess: (data: AuthResponse) => {
      // Store user ve tokens
      setUser(data.user)
      setTokens(data.tokens)
      setIsLoading(false)

      // Save tokens to localStorage
      localStorage.setItem('auth-tokens', JSON.stringify(data.tokens))

      // Invalidate all queries to fetch fresh data with auth
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error: Error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })
}

/**
 * useRegisterMutation - Register new user
 */
export function useRegisterMutation() {
  const queryClient = useQueryClient()
  const { setUser, setTokens, setIsLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      return AuthService.register(data)
    },
    onMutate: () => {
      setIsLoading(true)
      setError(null)
    },
    onSuccess: (data: AuthResponse) => {
      setUser(data.user)
      setTokens(data.tokens)
      setIsLoading(false)

      localStorage.setItem('auth-tokens', JSON.stringify(data.tokens))

      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error: Error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })
}

/**
 * useLogoutMutation - Logout user
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const { logout, setIsLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      return AuthService.logout()
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: () => {
      logout()
      localStorage.removeItem('auth-tokens')
      localStorage.removeItem('refresh-token')
      setIsLoading(false)

      // Invalidate all queries
      queryClient.clear()
    },
    onError: (error: Error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })
}
