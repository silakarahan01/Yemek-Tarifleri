/**
 * Zustand auth store
 *
 * Responsibilities:
 * - Kullanıcı oturumu state'i (user, tokens)
 * - Login/logout actions
 * - isAuthenticated computed state
 * - localStorage persistence
 *
 * Bir store, SOLID prensipleri uygulanmış, 100 satırdan az
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, AuthActions } from '@/types/auth.types'

/**
 * Auth store tanımı
 * State ve actions bir arada
 */
type AuthStore = AuthState & AuthActions

/**
 * Zustand store oluştur
 *
 * Features:
 * - persist middleware: localStorage'da tutma
 * - state'i serde ettik (tokens'ı serialize etmek için custom logic)
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      // State
      user: null,
      tokens: null,
      isLoading: false,
      error: null,

      // Computed
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set(() => ({
          user,
          // isAuthenticated'ı güncelle
          isAuthenticated: user !== null,
        })),

      setTokens: (tokens) =>
        set({
          tokens,
          isAuthenticated: tokens !== null,
        }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      /**
       * Logout action
       * User ve tokens'ı temizle
       */
      logout: () =>
        set({
          user: null,
          tokens: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
        }),

      /**
       * State'i tamamen reset et
       */
      reset: () =>
        set({
          user: null,
          tokens: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
        }),
    }),
    {
      // Persistence config
      name: 'auth-store',
      // Hang tokens'ı localStorage'da tutma (sensitive data)
      // Token'lar HTTP-Only cookie'de olmalı (production)
      partialize: (state) => ({
        user: state.user,
        // tokens'ı persist etme - sayfayı yeniledikten sonra re-fetch et
      }),
    }
  )
)

/**
 * Computed selector: user'ın authenticated mi
 * Component'lerde kullanmak daha clean olacak
 *
 * @example
 * const isAuth = useAuthStore(useIsAuthenticated)
 * // veya
 * const isAuth = useAuthStore((s) => s.isAuthenticated)
 */
export const useIsAuthenticated = (state: AuthStore) => state.isAuthenticated

/**
 * Computed selector: current user
 */
export const useCurrentUser = (state: AuthStore) => state.user
