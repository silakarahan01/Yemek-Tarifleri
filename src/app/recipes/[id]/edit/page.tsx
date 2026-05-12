'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import {
  useRecipeDetailQueryOptional,
  useUpdateRecipeMutation,
} from '@/services/query/recipe.queries'
import {
  RecipeForm,
  RecipeFormInitialValues,
} from '@/components/organisms/RecipeForm/RecipeForm'
import { Skeleton } from '@/components/atoms/Skeleton'
import { btnClass } from '@/components/atoms/Button'

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { data: recipe, isLoading } = useRecipeDetailQueryOptional(id)
  const updateMutation = useUpdateRecipeMutation(id)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=/recipes/${id}/edit`)
    }
  }, [isAuthenticated, id, router])

  if (isLoading || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container max-w-3xl">
          <Skeleton className="h-10 w-2/3 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  const isOwner = !!user && recipe.author?.id === user.id
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bu tarifi düzenleme yetkiniz yok
          </h1>
          <Link href={`/recipes/${id}`} className={btnClass}>
            Tarife geri dön
          </Link>
        </div>
      </div>
    )
  }

  const initialValues: RecipeFormInitialValues = {
    title: recipe.title,
    description: recipe.description,
    category: recipe.categories[0] ?? 'dinner',
    difficulty: recipe.difficulty,
    prep_time: recipe.prepTimeMinutes,
    cook_time: recipe.cookTimeMinutes,
    servings: recipe.servings,
    image_url: recipe.imageUrl,
    ingredients: recipe.ingredients.map((i) => ({ name: i.name, amount: i.amount })),
    instructions: recipe.instructions.map((i) => ({
      step: i.stepNumber,
      description: i.instruction,
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-3xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tarifi Düzenle</h1>
          <p className="text-gray-600 mt-2">{recipe.title}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <RecipeForm
            initialValues={initialValues}
            submitLabel="Değişiklikleri Kaydet"
            isSubmitting={updateMutation.isPending}
            error={updateMutation.error?.message ?? null}
            onSubmit={(payload) =>
              updateMutation.mutate(payload, {
                onSuccess: () => router.push(`/recipes/${id}`),
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
