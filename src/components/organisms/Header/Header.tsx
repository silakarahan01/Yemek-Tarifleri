'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useLogoutMutation } from '@/services/query/auth.queries'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { mutate: logout } = useLogoutMutation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const isDarkMode =
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push('/recipes')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container h-16">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Logo */}
          <Link href="/recipes" className="flex items-center space-x-2 font-bold text-xl flex-shrink-0">
            <span className="text-2xl">🍳</span>
            <span className="text-gray-900 dark:text-white">TarifKüpü</span>
          </Link>

          {/* Desktop Search Bar - Center */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tarif ara..."
              className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              aria-label="Ara"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Desktop Navigation - Right Side */}
          <nav className="hidden md:flex items-center space-x-6 flex-shrink-0">

            {isAuthenticated ? (
              <>
                <Link
                  href="/favorites"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  ❤️ Favorilerim
                </Link>

                <div className="flex items-center space-x-4 pl-6 border-l border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Merhaba, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Çıkış
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200 dark:border-gray-700">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  Kaydol
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <nav className="container py-4 space-y-2">
            <Link
              href="/recipes"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarifler
            </Link>

            {/* Mobile Search Form */}
            <form onSubmit={handleSearch} className="px-4 py-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tarif ara..."
                  className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  aria-label="Ara"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {isAuthenticated ? (
              <>
                <Link
                  href="/favorites"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ❤️ Favorilerim
                </Link>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Merhaba, {user?.name}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Çıkış
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kaydol
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
