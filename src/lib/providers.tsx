/**
 * App providers - TanStack Query, Error boundary, vb
 *
 * Next.js 13+ App Router'da client-side providers'ları
 * root layout.tsx'te "use client" directive'si ile wrap et
 *
 * @example
 * // app/layout.tsx
 * import { Providers } from '@/lib/providers'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   )
 * }
 */

'use client'

import React, { ReactNode } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * Singleton QueryClient
 * Re-initialize etmemek için global instance
 *
 * Config:
 * - defaultOptions: tüm queries için default ayarlar
 * - logger: hata loglaması
 */
const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Inactive queries'i temizle
        gcTime: 10 * 60 * 1000, // 10 minutes
        // Network'e geri gelince refetch yapma
        refetchOnWindowFocus: false,
        // Mount'ta refetch yapma (stale ise refetch et)
        refetchOnMount: false,
        // Poll yapmayacak
        refetchInterval: false,
        // Retry policy
        retry: (failureCount, error) => {
          // 3 kez retry et
          if (failureCount >= 3) return false
          // 401 ve 404 hataları retry etme
          if (error instanceof Error && error.message.includes('401')) return false
          if (error instanceof Error && error.message.includes('404')) return false
          return true
        },
        // Retry delay (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Mutation retry policy
        retry: 1,
        retryDelay: 1000,
      },
    },
  })
}

// Singleton instance - SSR sırasında farklı client'lara ihtiyaç yoktur
// Ama best practice olarak, per-request instance oluşturmak istersek:
let clientQueryClientInstance: QueryClient | undefined = undefined

export const getQueryClient = (): QueryClient => {
  if (typeof window === 'undefined') {
    // Server'da: her request'te yeni instance oluştur
    return createQueryClient()
  }

  // Client'de: singleton instance kullan
  if (!clientQueryClientInstance) {
    clientQueryClientInstance = createQueryClient()
  }

  return clientQueryClientInstance
}

interface ProvidersProps {
  children: ReactNode
}

/**
 * App providers wrapper component
 * Root layout'ta <Providers> ile wrap et
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Client'de: memoize QueryClient
  const queryClient = React.useMemo(() => getQueryClient(), [])

  // MSW disabled — real Django backend in use

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* React Query Devtools - production'da disabled */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

export default Providers
