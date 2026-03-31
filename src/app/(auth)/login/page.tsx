'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLoginMutation } from '@/services/query/auth.queries'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: login, isPending } = useLoginMutation()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'E-posta adresi gerekli'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!password) {
      newErrors.password = 'Şifre gerekli'
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    login(
      { email, password },
      {
        onSuccess: () => {
          router.push('/recipes')
        },
        onError: (error) => {
          setErrors({ submit: error.message || 'Giriş başarısız' })
        },
      }
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white flex-col items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div>
            <div className="text-6xl mb-4">🍳</div>
            <h1 className="text-4xl font-bold mb-4">TarifKüpü</h1>
            <p className="text-xl opacity-90">Lezzetli tarifler keşfet, favorilere ekle ve paylaş</p>
          </div>
          <div className="space-y-4 pt-8 border-t border-white/20">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🥘</span>
              <div className="text-left">
                <p className="font-semibold">Binlerce Tarif</p>
                <p className="text-sm opacity-75">Türk mutfağının en güzel tariflerini keşfet</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">❤️</span>
              <div className="text-left">
                <p className="font-semibold">Favorilere Ekle</p>
                <p className="text-sm opacity-75">Sevdiğin tarifləri kaydet ve istediğin zaman eriş</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="font-semibold">Puanla ve Yorum Yap</p>
                <p className="text-sm opacity-75">Denediğin tarifləri puanla, komuniteyi yardımcı ol</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-3">🍳</div>
            <h1 className="text-3xl font-bold text-gray-900">TarifKüpü</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="mt-2 text-gray-600">Hesabınıza giriş yaparak başlayın</p>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                  errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                )}
                placeholder="örnek@mail.com"
                disabled={isPending}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  disabled={isPending}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'w-full py-3 bg-brand-500 text-white font-medium rounded-lg transition-all duration-200',
                'hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isPending ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin">⏳</span>
                  <span>Giriş yapılıyor...</span>
                </span>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500" style={{ backgroundColor: '#FFFFFF' }}>Yeni misiniz?</span>
            </div>
          </div>

          <Link
            href="/register"
            className={cn(
              'block w-full py-3 text-center border border-gray-300 text-gray-700',
              'font-medium rounded-lg transition-all duration-200',
              'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/50'
            )}
          >
            Hesap Oluştur
          </Link>
        </div>
      </div>
    </div>
  )
}
