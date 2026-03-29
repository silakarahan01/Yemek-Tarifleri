/**
 * Tarif domain types
 * Recipe ile ilgili tüm veri yapıları burada tanımlanır
 */

/**
 * Tarifin zorunlu ve opsiyonel tüm alanları
 * Backend'den gelen complete recipe data
 */
export interface Recipe {
  id: string
  title: string
  description: string
  /** Tarifin hazırlanması için gereken dakika */
  prepTimeMinutes: number
  /** Pişirme süresi dakika */
  cookTimeMinutes: number
  /** Tarif kaç kişi için */
  servings: number
  /** Tarifin zor seviyesi: easy | medium | hard */
  difficulty: RecipeDifficulty
  /** Tarif kategorileri */
  categories: RecipeCategory[]
  /** Malzemeler listesi */
  ingredients: Ingredient[]
  /** Hazırlama adımları */
  instructions: Instruction[]
  /** Tarifin ana görseli URL'si */
  imageUrl: string
  /** Alternatif görseller */
  imageUrls?: string[]
  /** Beslenme bilgileri */
  nutrition?: NutritionInfo
  /** Rating ortalaması 0-5 */
  rating: number
  /** Yorum sayısı */
  reviewCount: number
  /** Favoriye eklenen sayısı */
  favoriteCount: number
  /** Yayınlanma tarihi */
  createdAt: string
  /** Son güncellenme */
  updatedAt: string
  /** Tarifi oluşturan kullanıcı */
  author?: {
    id: string
    name: string
    avatarUrl?: string
  }
}

/**
 * Liste görünümü için light recipe data
 * DetailPage tarafından kullanılmayan alanları exclude eder
 */
export interface RecipeListItem {
  id: string
  title: string
  imageUrl: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  difficulty: RecipeDifficulty
  rating: number
  reviewCount: number
  favoriteCount: number
}

/**
 * Zorluk seviyeleri
 */
export enum RecipeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/**
 * Tarif kategorileri (enum yerine string union daha fleksibel)
 */
export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'beverage'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'

/**
 * Malzeme bilgisi
 */
export interface Ingredient {
  id: string
  name: string
  /** Miktar (örneğin "2")*/
  amount: string
  /** Birim (örneğin "cups", "tablespoons") */
  unit: string
  /** Opsiyonel notlar (örneğin "finely chopped") */
  notes?: string
}

/**
 * Hazırlama adımı
 */
export interface Instruction {
  stepNumber: number
  instruction: string
  /** Opsiyonel: bu adım kaç dakika sürüyor */
  durationMinutes?: number
  /** Opsiyonel: adımla ilgili görseller */
  imageUrl?: string
}

/**
 * Beslenme bilgileri (per serving)
 */
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
}

/**
 * Liste endpoint'i parametreleri
 */
export interface RecipeListParams {
  page?: number
  pageSize?: number
  /** Arama sorgusu (title, description'da arama yapar) */
  search?: string
  /** Kategorilere göre filter */
  categories?: RecipeCategory[]
  /** Zorluk seviyesi filter */
  difficulty?: RecipeDifficulty
  /** Maksimum hazırlık süresi */
  maxPrepTime?: number
  /** Sorting: 'newest' | 'rating' | 'popular' */
  sortBy?: 'newest' | 'rating' | 'popular'
}

/**
 * Tarif filter state'i (component'lerde kullanılır)
 */
export interface RecipeFilter {
  search: string
  categories: RecipeCategory[]
  difficulty: RecipeDifficulty | null
  maxPrepTime: number | null
  sortBy: 'newest' | 'rating' | 'popular'
}
