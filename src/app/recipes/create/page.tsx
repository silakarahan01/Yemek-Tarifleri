'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { useCreateRecipeMutation } from '@/services/query/recipe.queries'
import { RecipeForm } from '@/components/organisms/RecipeForm/RecipeForm'
import { btnClass } from '@/components/atoms/Button'

export default function CreateRecipePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const createMutation = useCreateRecipeMutation()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login?next=/recipes/create')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tarif eklemek için giriş yapın
          </h1>
          <Link href="/login?next=/recipes/create" className={btnClass}>
            Giriş Yap
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-3xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Yeni Tarif Ekle</h1>
          <p className="text-gray-600 mt-2">
            Lezzetli tarifini topluluğumuzla paylaş
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <RecipeForm
            isSubmitting={createMutation.isPending}
            error={createMutation.error?.message ?? null}
            onSubmit={(payload) =>
              createMutation.mutate(payload, {
                onSuccess: (recipe) => router.push(`/recipes/${recipe.id}`),
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
