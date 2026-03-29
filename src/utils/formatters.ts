/**
 * Formatting utility functions
 */

/**
 * Format cooking time (minutes) to readable string
 * @example formatTime(45) => "45 dk"
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} dk`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours} s`
  }
  return `${hours} s ${mins} dk`
}

/**
 * Format total cooking time
 * @example formatTotalTime({ prepTimeMinutes: 15, cookTimeMinutes: 30 }) => "45 dk toplam"
 */
export function formatTotalTime(
  prepTimeMinutes: number,
  cookTimeMinutes: number
): string {
  const total = prepTimeMinutes + cookTimeMinutes
  return `${formatTime(total)} toplam`
}

/**
 * Format difficulty level in Turkish
 */
export function formatDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  }
  return map[difficulty.toLowerCase()] || difficulty
}

/**
 * Format number with comma thousands separator
 * @example formatNumber(1234567) => "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('tr-TR')
}

/**
 * Format calorie count
 * @example formatCalories(450) => "450 kcal"
 */
export function formatCalories(calories: number): string {
  return `${formatNumber(calories)} kcal`
}

/**
 * Format nutrition value
 * @example formatNutrition(25.5) => "25.5g"
 */
export function formatNutrition(value: number): string {
  return `${value.toFixed(1)}g`
}

/**
 * Format date to Turkish format
 * @example formatDate("2024-03-15T10:30:00Z") => "15 Mart 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format rating (1-5)
 * @example formatRating(4.5) => "4.5 ⭐"
 */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} ${getStarIcon(rating)}`
}

/**
 * Get star icon based on rating
 */
function getStarIcon(rating: number): string {
  if (rating >= 4.5) return '⭐'
  if (rating >= 4) return '⭐'
  if (rating >= 3) return '⭐'
  return '⭐'
}

/**
 * Format servings
 * @example formatServings(4) => "4 kişi için"
 */
export function formatServings(servings: number): string {
  return `${servings} kişi için`
}

/**
 * Format favorite count
 * @example formatFavoriteCount(1234) => "1.2K favoriye eklendi"
 */
export function formatFavoriteCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K favoriye eklendi`
  }
  return `${count} favoriye eklendi`
}
