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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="text-center max-w-md">
        <div className="text-9xl mb-6 animate-pulse">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Hata Oluştu!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
        </p>

        {error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 break-all">
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
              'block px-6 py-4 bg-white text-gray-900',
              'border-2 border-gray-300 font-semibold rounded-lg',
              'hover:bg-gray-50 transition-all duration-200'
            )}
          >
            Tarifləre Dön
          </Link>
          <Link
            href="/"
            className={cn(
              'block px-6 py-4 text-gray-700 font-semibold rounded-lg',
              'hover:text-brand-600 transition-colors'
            )}
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
