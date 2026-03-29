import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-brand-500 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Sayfa Bulunamadı
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Aradığınız sayfa var olmayabilir veya silinmiş olabilir.
        </p>

        <div className="space-y-3">
          <Link
            href="/recipes"
            className="block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
          >
            Tariflere Dön
          </Link>
          <Link
            href="/search"
            className="block px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Ara
          </Link>
        </div>
      </div>
    </div>
  )
}
