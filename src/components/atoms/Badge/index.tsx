/**
 * Badge Atom Component
 * Reusable badge for difficulty levels, categories, tags, etc.
 */

import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'brand' | 'gray' | 'success' | 'warning' | 'danger'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-100 text-brand-800',
  gray: 'bg-gray-100 text-gray-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-3 py-1.5 text-sm font-medium',
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant = 'gray', size = 'md', className, icon }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full whitespace-nowrap transition-colors duration-200',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
