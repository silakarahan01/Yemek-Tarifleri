'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" style={{ backgroundColor: '#f9f7f4' }}>
      <div className="text-center max-w-md">
        <div className="text-9xl mb-6 animate-pulse">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Hata Oluştu!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
        </p>

        {error.message && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className={cn(
              'w-full px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg',
              'transition-all duration-200 shadow-md hover:shadow-lg'
            )}
          >
            🔄 Tekrar Dene
          </button>
          <Link
            href="/recipes"
            className={cn(
              'block px-6 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              'border-2 border-gray-300 dark:border-gray-600 font-semibold rounded-lg',
              'hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200'
            )}
          >
            Tarifləre Dön
          </Link>
          <Link
            href="/"
            className={cn(
              'block px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold rounded-lg',
              'hover:text-brand-600 dark:hover:text-brand-400 transition-colors'
            )}
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-500 dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
