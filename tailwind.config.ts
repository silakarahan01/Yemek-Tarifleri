/**
 * Tailwind CSS Configuration
 *
 * Design system tanımları:
 * - Color palette (brand colors, semantic colors)
 * - Typography scale
 * - Spacing scale
 * - Custom components (optional)
 *
 * Bilgiler: https://tailwindcss.com/docs/configuration
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      /**
       * Color Palette - Recipe platformu için
       */
      colors: {
        // Brand colors
        brand: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fadac2',
          300: '#f5bb9e',
          400: '#ed8d5f', // Primary orange
          500: '#e35a2b',
          600: '#d64a1f',
          700: '#b63a1a',
          800: '#8e2f15',
          900: '#6b2312',
        },

        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Neutral scale
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },

      /**
       * Typography scale
       */
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      /**
       * Font family
       */
      fontFamily: {
        // Sans serif - main text
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        // Serif - headings (optional)
        serif: ['Georgia', 'serif'],
        // Mono - code
        mono: ['"Fira Code"', '"Courier New"', 'monospace'],
      },

      /**
       * Spacing scale (8px base)
       */
      spacing: {
        0: '0',
        1: '0.25rem', // 4px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        16: '4rem', // 64px
        20: '5rem', // 80px
        24: '6rem', // 96px
        32: '8rem', // 128px
      },

      /**
       * Border radius
       */
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        base: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },

      /**
       * Box shadows
       */
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      /**
       * Animation'lar
       */
      animation: {
        // Pulse (skeleton loading)
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Spin (loading spinner)
        spin: 'spin 1s linear infinite',
        // Bounce (attention)
        bounce: 'bounce 1s infinite',
        // Fade in
        'fade-in': 'fadeIn 0.3s ease-in-out',
        // Slide down (dropdown)
        'slide-down': 'slideDown 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      /**
       * Transition duration
       */
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },

      /**
       * Responsive breakpoints (mobile-first)
       */
      screens: {
        xs: '320px',
        sm: '640px', // default
        md: '768px', // default
        lg: '1024px', // default
        xl: '1280px', // default
        '2xl': '1536px', // default
      },
    },
  },

  plugins: [],

  /**
   * Dark mode - class-based strategy
   * <html class="dark"> eklersen dark mode enable olur
   */
  darkMode: 'class',
}

export default config
