/**
 * RecipeForm — tarif oluşturma ve düzenleme için ortak form
 *
 * Kullanım:
 * - Create modunda: initialValues yok, onSubmit ile yeni payload gönderilir
 * - Edit modunda: initialValues geçilir, onSubmit aynı payload'ı update için kullanır
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { RecipeWritePayload } from '@/services/api/recipe.service'

const CATEGORY_OPTIONS = [
  { value: 'breakfast', label: 'Kahvaltı' },
  { value: 'lunch', label: 'Öğle Yemeği' },
  { value: 'dinner', label: 'Akşam Yemeği' },
  { value: 'dessert', label: 'Tatlı' },
  { value: 'snack', label: 'Ara Sıcak' },
  { value: 'soup', label: 'Çorba' },
  { value: 'salad', label: 'Salata' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Kolay' },
  { value: 'medium', label: 'Orta' },
  { value: 'hard', label: 'Zor' },
]

export interface RecipeFormInitialValues {
  title: string
  description: string
  category: string
  difficulty: string
  prep_time: number
  cook_time: number
  servings: number
  image_url: string
  ingredients: { name: string; amount: string }[]
  instructions: { step: number; description: string }[]
}

const EMPTY_INITIAL: RecipeFormInitialValues = {
  title: '',
  description: '',
  category: 'dinner',
  difficulty: 'medium',
  prep_time: 15,
  cook_time: 30,
  servings: 4,
  image_url: '',
  ingredients: [{ name: '', amount: '' }],
  instructions: [{ step: 1, description: '' }],
}

interface RecipeFormProps {
  initialValues?: RecipeFormInitialValues
  submitLabel?: string
  isSubmitting?: boolean
  error?: string | null
  onSubmit: (payload: RecipeWritePayload) => void
}

export function RecipeForm({
  initialValues = EMPTY_INITIAL,
  submitLabel = 'Tarifi Kaydet',
  isSubmitting = false,
  error = null,
  onSubmit,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialValues.title)
  const [description, setDescription] = useState(initialValues.description)
  const [category, setCategory] = useState(initialValues.category)
  const [difficulty, setDifficulty] = useState(initialValues.difficulty)
  const [prepTime, setPrepTime] = useState(initialValues.prep_time)
  const [cookTime, setCookTime] = useState(initialValues.cook_time)
  const [servings, setServings] = useState(initialValues.servings)
  const [imageUrl, setImageUrl] = useState(initialValues.image_url)
  const [ingredients, setIngredients] = useState(initialValues.ingredients)
  const [instructions, setInstructions] = useState(initialValues.instructions)
  const [validationError, setValidationError] = useState<string | null>(null)

  const updateIngredient = (idx: number, field: 'name' | 'amount', value: string) => {
    setIngredients((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)))
  }

  const addIngredient = () => setIngredients((prev) => [...prev, { name: '', amount: '' }])
  const removeIngredient = (idx: number) =>
    setIngredients((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))

  const updateInstruction = (idx: number, value: string) => {
    setInstructions((prev) => prev.map((it, i) => (i === idx ? { ...it, description: value } : it)))
  }

  const addInstruction = () =>
    setInstructions((prev) => [...prev, { step: prev.length + 1, description: '' }])

  const removeInstruction = (idx: number) =>
    setInstructions((prev) =>
      prev.length > 1
        ? prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, step: i + 1 }))
        : prev
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedIngredients = ingredients
      .map((i) => ({ name: i.name.trim(), amount: i.amount.trim() }))
      .filter((i) => i.name && i.amount)

    const cleanedInstructions = instructions
      .map((s, i) => ({ step: i + 1, description: s.description.trim() }))
      .filter((s) => s.description)

    if (!title.trim() || !description.trim()) {
      setValidationError('Başlık ve açıklama zorunlu.')
      return
    }
    if (cleanedIngredients.length === 0) {
      setValidationError('En az bir malzeme girin.')
      return
    }
    if (cleanedInstructions.length === 0) {
      setValidationError('En az bir hazırlama adımı girin.')
      return
    }

    setValidationError(null)
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      prep_time: Number(prepTime) || 0,
      cook_time: Number(cookTime) || 0,
      servings: Number(servings) || 1,
      image_url: imageUrl.trim() || undefined,
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
    })
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316]'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Tarif Başlığı</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="ör: Klasik Mercimek Çorbası"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[100px]`}
          placeholder="Bu tarif neden özel? Kısa bir açıklama yazın."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Görsel URL (opsiyonel)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Zorluk</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputClass}>
            {DIFFICULTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Hazırlık (dk)</label>
          <input
            type="number"
            min={0}
            value={prepTime}
            onChange={(e) => setPrepTime(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Pişirme (dk)</label>
          <input
            type="number"
            min={0}
            value={cookTime}
            onChange={(e) => setCookTime(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Kaç kişilik</label>
          <input
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">Malzemeler</label>
          <button type="button" onClick={addIngredient} className="text-sm text-[#F97316] hover:underline">
            + Malzeme ekle
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={ing.amount}
                onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                className={`${inputClass} flex-shrink-0 w-32`}
                placeholder="2 yemek kaşığı"
              />
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="zeytinyağı"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="px-3 text-gray-500 hover:text-red-600"
                  aria-label="Malzemeyi sil"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">Hazırlama Adımları</label>
          <button type="button" onClick={addInstruction} className="text-sm text-[#F97316] hover:underline">
            + Adım ekle
          </button>
        </div>
        <div className="space-y-2">
          {instructions.map((ins, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-100 rounded">
                {idx + 1}
              </div>
              <textarea
                value={ins.description}
                onChange={(e) => updateInstruction(idx, e.target.value)}
                className={`${inputClass} flex-1 min-h-[60px]`}
                placeholder="Bu adımda ne yapılır?"
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(idx)}
                  className="px-3 text-gray-500 hover:text-red-600"
                  aria-label="Adımı sil"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {(validationError || error) && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {validationError ?? error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
