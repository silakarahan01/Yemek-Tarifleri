/**
 * useDebounce - Generic debounce hook
 *
 * Value'yu geciktirir ve stabilitesini sağlar
 * Arama kutusu, form input'ları, resize listeners için ideal
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 *
 * useEffect(() => {
 *   // Şu nur debouncedSearchTerm'e etki et
 *   // Hiç değişmiyorsa effect çalışmaz
 * }, [debouncedSearchTerm])
 */

import { useState, useEffect } from 'react'

/**
 * Debounce hook
 *
 * @template T - Value tipi (string, number, object, vb)
 * @param value - Debounce'lanacak value
 * @param delay - Debounce delay (ms) — default 500ms
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Timer'ı başlat
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: value değiştiğinde veya component unmount'a timer'ı iptal et
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
