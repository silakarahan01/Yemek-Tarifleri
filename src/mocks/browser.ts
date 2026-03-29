/**
 * MSW Browser Worker Setup
 *
 * Browser environment'da istekleri intercept eder
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW browser worker oluştur
 * Development'ta import edip start() çağırılır
 */
export const worker = setupWorker(...handlers)
