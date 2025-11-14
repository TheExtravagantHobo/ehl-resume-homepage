// components/ui/index.tsx

/**
 * Reusable UI Components
 * All components use the centralized design system
 */

import React from 'react'
import { components, cn } from '@/lib/design-system'
import { useTheme } from '@/components/providers/ThemeProvider'

// ============================================
// BUTTON COMPONENT
// ============================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    const variantClasses = {
      primary: components.button.primary,
      secondary: components.button.secondary,
      outline: components.button.outline,
      ghost: 'text-gray-400 hover:text-white hover:bg-slate-800',
    }

    return (
      <button
        ref={ref}
        className={cn(
          components.button.base,
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ============================================
// CARD COMPONENT
// ============================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          components.card.base,
          components.card.dark,
          hover && 'hover:shadow-xl hover:scale-[1.02]',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// ============================================
// INPUT COMPONENT
// ============================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            components.input.base,
            components.input.dark,
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ============================================
// TEXTAREA COMPONENT
// ============================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            components.input.base,
            components.input.dark,
            'min-h-[100px] resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ============================================
// BADGE COMPONENT
// ============================================
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-slate-700 text-gray-300',
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ============================================
// DIVIDER COMPONENT
// ============================================
interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export const Divider: React.FC<DividerProps> = ({ 
  className, 
  orientation = 'horizontal',
  label,
  ...props 
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('w-px bg-slate-700 h-full', className)}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div className={cn('relative my-8', className)} {...props}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-900 text-gray-400">{label}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('h-px bg-slate-700 w-full my-8', className)}
      {...props}
    />
  )
}

// ============================================
// LOADING SPINNER COMPONENT
// ============================================
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  className, 
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn('flex justify-center items-center', className)} {...props}>
      <svg 
        className={cn('animate-spin text-purple-500', sizeClasses[size])} 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4" 
          fill="none" 
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
    </div>
  )
}

// ============================================
// CONTAINER COMPONENT
// ============================================
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Container: React.FC<ContainerProps> = ({ 
  className, 
  size = 'lg',
  children,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================
// SECTION COMPONENT
// ============================================
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg'
}

export const Section: React.FC<SectionProps> = ({ 
  className, 
  spacing = 'md',
  children,
  ...props 
}) => {
  const spacingClasses = {
    sm: 'py-8 sm:py-12',
    md: 'py-16 sm:py-20',
    lg: 'py-24 sm:py-32',
  }

  return (
    <section
      className={cn(spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </section>
  )
}

// ============================================
// SKELETON LOADER COMPONENT
// ============================================
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'text',
  width,
  height,
  ...props 
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-700',
        variantClasses[variant],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? 40 : '100%'),
        height: height || (variant === 'circular' ? 40 : variant === 'rectangular' ? 60 : 16),
      }}
      {...props}
    />
  )
}

// ============================================
// ALERT COMPONENT
// ============================================
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

export const Alert: React.FC<AlertProps> = ({ 
  className, 
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  children,
  ...props 
}) => {
  const variantClasses = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
  }

  const iconMap = {
    info: '💡',
    success: '✓',
    warning: '⚠',
    error: '✕',
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <span className="text-lg mr-3">{iconMap[variant]}</span>
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="ml-3 text-current opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
