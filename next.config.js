/**
 * Next.js Configuration
 *
 * App Router, Image optimization, Environment variables vb
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode'u enable et
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
    // Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Geliştirme'de caching disable et
    minimumCacheTTL: 60,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Yemek Tarifleri',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },

  // Headers (security, CORS, vb)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return []
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // WebPack optimization
  webpack: (config, { isServer }) => {
    // TypeScript path resolution fix for Windows
    config.resolve.fallback = {
      ...config.resolve.fallback,
    }
    return config
  },

  // TypeScript options
  typescript: {
    tsconfigPath: './tsconfig.json',
    // Windows path separator fix
    ignoreBuildErrors: false,
  },

  // SSR uyarı'larını kapat (tercihe göre)
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig
