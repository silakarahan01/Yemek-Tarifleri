'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { useMyRecipesQuery } from '@/services/query/recipe.queries'
import { AuthService } from '@/services/api/auth.service'
import { RecipeCard } from '@/components/molecules/RecipeCard/RecipeCard'
import { RecipeCardSkeleton } from '@/components/molecules/RecipeCard/RecipeCardSkeleton'
import { Button, btnClass } from '@/components/atoms/Button'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuthStore()
  const queryClient = useQueryClient()
  const { data: myRecipes, isLoading } = useMyRecipesQuery(isAuthenticated)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')

  useEffect(() => {
    setName(user?.name ?? '')
  }, [user?.name])

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login?next=/profile')
    }
  }, [isAuthenticated, router])

  const updateMutation = useMutation({
    mutationFn: (newName: string) => AuthService.updateMe({ name: newName }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş yapmanız gerekiyor</h1>
          <Link href="/login?next=/profile" className={btnClass}>
            Giriş Yap
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-5xl py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {editing ? 'Profili Düzenle' : user.name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Üyelik tarihi:{' '}
                {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {!editing && (
              <Button type="button" onClick={() => setEditing(true)}>
                Düzenle
              </Button>
            )}
          </div>

          {editing && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (name.trim()) updateMutation.mutate(name.trim())
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  İsim
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316]"
                  required
                />
              </div>
              {updateMutation.error && (
                <p className="text-sm text-red-700">{updateMutation.error.message}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" loading={updateMutation.isPending}>
                  Kaydet
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setName(user.name)
                  }}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold text-sm"
                >
                  İptal
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tariflerim</h2>
          <Link href="/recipes/create" className={btnClass}>
            + Yeni Tarif
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : myRecipes && myRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-lg text-gray-600 mb-4">Henüz tarifiniz yok</p>
            <Link href="/recipes/create" className={btnClass}>
              İlk Tarifinizi Ekleyin
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
