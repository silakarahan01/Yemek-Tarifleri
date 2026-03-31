'use client'

import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RecipesError({ reset }: ErrorProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tarifler Yüklenemiyor
          </h1>
          <p className="text-gray-600 mb-6">
            Tarifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </p>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="block px-6 py-3 bg-white text-gray-900 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
