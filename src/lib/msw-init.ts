/**
 * MSW Initialization
 *
 * Browser'de Mock Service Worker'ı başlat
 * Tüm axios istekleri MSW tarafından intercept edilir
 */

export async function initializeMSW() {
  // Development'ta MSW'yi başlat
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }

  // Browser Worker'ı dinamik olarak yükle
  try {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      // Warningları console'a yazdırma
      quiet: true,
      // Onunmatched handler'ları pass through yap
      onUnhandledRequest: 'bypass',
    })
    console.log('✓ MSW initialized (mock API)')
  } catch (error) {
    console.error('Failed to initialize MSW:', error)
  }
}
