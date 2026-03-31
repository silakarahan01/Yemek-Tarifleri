import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="text-center max-w-md">
        <div className="text-9xl mb-6 animate-bounce">🍽️</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tarif Bulunamadı
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Aradığınız sayfa var olmayabilir veya silinmiş olabilir. Başka bir tarif bulmaya çalışın.
        </p>

        <div className="space-y-3">
          <Link
            href="/recipes"
            className={cn(
              'block px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg',
              'transition-all duration-200 shadow-md hover:shadow-lg'
            )}
          >
            Tüm Tarifləri Gör
          </Link>
          <Link
            href="/search"
            className={cn(
              'block px-6 py-4 bg-white text-gray-900',
              'border-2 border-gray-300 font-semibold rounded-lg',
              'hover:bg-gray-50 transition-all duration-200'
            )}
          >
            Tarif Ara
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
      </div>
    </div>
  )
}
