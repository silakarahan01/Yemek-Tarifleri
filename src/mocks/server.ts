/**
 * MSW Server Setup - Node.js environment için
 *
 * Test veya development'ta axios isteklerini intercept eder
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server oluştur ve handlers'ı kayıt et
 */
export const server = setupServer(...handlers)

/**
 * Development'ta MSW'yi başlat (next dev sırasında)
 *
 * Usage:
 * if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
 *   server.listen()
 * }
 */
