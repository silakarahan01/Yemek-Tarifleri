'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRegisterMutation } from '@/services/query/auth.queries'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: register, isPending } = useRegisterMutation()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Ad gerekli'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Ad en az 2 karakter olmalı'
    }

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gerekli'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre doğrulaması gerekli'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Şartları ve koşulları kabul etmelisiniz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    register(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
      },
      {
        onSuccess: () => {
          router.push('/recipes')
        },
        onError: (error) => {
          setErrors({ submit: error.message || 'Kayıt başarısız' })
        },
      }
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white flex-col items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div>
            <div className="text-6xl mb-4">🍳</div>
            <h1 className="text-4xl font-bold mb-4">TarifKüpü</h1>
            <p className="text-xl opacity-90">Topluluğa katıl ve lezzetli tarifler paylaş</p>
          </div>
          <div className="space-y-4 pt-8 border-t border-white/20">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🚀</span>
              <div className="text-left">
                <p className="font-semibold">Hızlı Kaydolma</p>
                <p className="text-sm opacity-75">Birkaç adımda hesap oluştur ve başla</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💾</span>
              <div className="text-left">
                <p className="font-semibold">Favori Tarifler</p>
                <p className="text-sm opacity-75">Sevdiğin tarifləri kolaylıkla kaydet</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👥</span>
              <div className="text-left">
                <p className="font-semibold">Komunite</p>
                <p className="text-sm opacity-75">Başkaları ile tarif paylaş ve öğren</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center dark:bg-gray-900 p-4 md:p-12 overflow-y-auto" style={{ backgroundColor: '#f9f7f4' }}>
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-3">🍳</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TarifKüpü</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kaydol</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Ücretsiz hesap oluştur ve başla</p>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                  'dark:bg-gray-800 dark:text-white dark:border-gray-600',
                  errors.name
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="Adınız Soyadınız"
                disabled={isPending}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                  'dark:bg-gray-800 dark:text-white dark:border-gray-600',
                  errors.email
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="örnek@mail.com"
                disabled={isPending}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                    'dark:bg-gray-800 dark:text-white dark:border-gray-600',
                    errors.password
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  disabled={isPending}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifreyi Onayla
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                    'dark:bg-gray-800 dark:text-white dark:border-gray-600',
                    errors.confirmPassword
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  disabled={isPending}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input
                id="acceptTerms"
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-gray-300 accent-brand-500 cursor-pointer"
                disabled={isPending}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Şartları ve koşulları</span> okudum ve kabul ediyorum
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600 dark:text-red-400 -mt-3">{errors.acceptTerms}</p>
            )}

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
                  <span>Kaydolunuyor...</span>
                </span>
              ) : (
                'Kaydol'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 dark:bg-gray-900 text-gray-500" style={{ backgroundColor: '#f9f7f4' }}>Zaten hesabınız var mı?</span>
            </div>
          </div>

          <Link
            href="/login"
            className={cn(
              'block w-full py-3 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
              'font-medium rounded-lg transition-all duration-200',
              'hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50'
            )}
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  )
}
