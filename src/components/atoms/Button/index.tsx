/**
 * Button Component - Reusable button variants
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost)
 * - Size variants (sm, md, lg)
 * - Loading state + disabled support
 * - Full a11y: aria-busy, aria-disabled, keyboard focus
 * - ForwardRef support (external libraries ile compatibility)
 *
 * @example
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="outline" disabled>Disabled</Button>
 * <Button loading>Loading...</Button>
 */

import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: Variant
  /** Button size */
  size?: Size
  /** Loading state - spinner göster, disabled yap */
  loading?: boolean
  /** Loading spinner text */
  loadingText?: string
  /** Async handler (otomatik loading state yönet) */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50',
  ghost: 'hover:bg-gray-100 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

/**
 * Button component with a11y support
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
