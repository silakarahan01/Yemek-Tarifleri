/**
 * Button — tek tasarım kaynağı
 * Turuncu arka plan, beyaz yazı.
 * `btnClass` sabitini <Link> veya başka elementlerde de kullanabilirsiniz.
 */

import React from 'react'
import { cn } from '@/lib/utils'

/** Tüm buton stillerinin tek kaynağı */
export const btnClass =
  'inline-flex items-center justify-center gap-2 ' +
  'px-5 py-2.5 rounded-lg ' +
  'bg-[#F97316] hover:bg-[#EA580C] text-white ' +
  'font-semibold text-sm ' +
  'transition-all duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed ' +
  'shadow-sm hover:shadow-md'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, loadingText = 'Yükleniyor...', disabled, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(btnClass, className)}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </>
      ) : children}
    </button>
  )
)

Button.displayName = 'Button'
export default Button
