/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * - Minimum 6 characters
 * - At least one uppercase letter (optional for MVP)
 * - At least one number (optional for MVP)
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6
}

/**
 * Get password validation error message
 */
export function getPasswordError(password: string): string | null {
  if (!password) {
    return 'Şifre gerekli'
  }
  if (password.length < 6) {
    return 'Şifre en az 6 karakter olmalı'
  }
  return null
}

/**
 * Validate name
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2
}

/**
 * Get name validation error message
 */
export function getNameError(name: string): string | null {
  if (!name.trim()) {
    return 'Ad gerekli'
  }
  if (name.length < 2) {
    return 'Ad en az 2 karakter olmalı'
  }
  return null
}

/**
 * Validate email and return error message
 */
export function getEmailError(email: string): string | null {
  if (!email) {
    return 'E-posta adresi gerekli'
  }
  if (!validateEmail(email)) {
    return 'Geçerli bir e-posta adresi girin'
  }
  return null
}

/**
 * Validate passwords match
 */
export function validatePasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

/**
 * Get password match error message
 */
export function getPasswordMatchError(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) {
    return 'Şifre doğrulaması gerekli'
  }
  if (!validatePasswordsMatch(password, confirmPassword)) {
    return 'Şifreler eşleşmiyor'
  }
  return null
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): boolean {
  return query.trim().length >= 2
}

/**
 * Validate rating (1-5)
 */
export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5
}

/**
 * Validate review comment (1-500 characters)
 */
export function validateReviewComment(comment: string): boolean {
  const trimmed = comment.trim()
  return trimmed.length >= 1 && trimmed.length <= 500
}
