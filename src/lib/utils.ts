/**
 * Utility: classname merger
 * Combines clsx for conditional classes + tailwind-merge for Tailwind deduplication
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500')
 * cn('p-2 p-4') // p-4 wins (deduped)
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
