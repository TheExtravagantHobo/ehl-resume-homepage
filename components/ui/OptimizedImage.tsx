'use client'
// components/ui/OptimizedImage.tsx

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/design-system'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width = 1200,
  height = 630,
  className,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  objectFit = 'cover',
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Handle external images
  const isExternal = src.startsWith('http')
  
  // For external images, we need to configure next.config.js
  // For now, fallback to regular img tag for external images
  if (isExternal && !process.env.NEXT_PUBLIC_ALLOW_EXTERNAL_IMAGES) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ objectFit }}
        onError={() => setError(true)}
      />
    )
  }

  // Fallback image for errors
  if (error) {
    return (
      <div 
        className={cn(
          'bg-slate-800 flex items-center justify-center',
          className
        )}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-center text-gray-500">
          <svg 
            className="w-12 h-12 mx-auto mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">Image failed to load</p>
        </div>
      </div>
    )
  }

  if (fill) {
    return (
      <div className={cn('relative', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={cn(
            'duration-700 ease-in-out',
            isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
          )}
          style={{ objectFit }}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={sizes}
      className={cn(
        className,
        'duration-700 ease-in-out',
        isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
      )}
      style={{ objectFit }}
      onLoadingComplete={() => setIsLoading(false)}
      onError={() => setError(true)}
    />
  )
}

// ============================================
// PROFILE IMAGE COMPONENT
// ============================================

export function ProfileImage({
  src,
  name,
  size = 'md',
  className,
}: {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeMap = {
    sm: { width: 40, height: 40, text: 'text-sm' },
    md: { width: 80, height: 80, text: 'text-lg' },
    lg: { width: 120, height: 120, text: 'text-2xl' },
    xl: { width: 160, height: 160, text: 'text-3xl' },
  }

  const { width, height, text } = sizeMap[size]

  if (!src) {
    // Fallback to initials
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-purple-600 to-blue-600',
          'flex items-center justify-center text-white font-semibold',
          text,
          className
        )}
        style={{ width, height }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div 
      className={cn('relative rounded-full overflow-hidden', className)}
      style={{ width, height }}
    >
      <OptimizedImage
        src={src}
        alt={name}
        fill
        objectFit="cover"
        priority
      />
    </div>
  )
}

// ============================================
// ARTICLE IMAGE COMPONENT
// ============================================

export function ArticleImage({
  src,
  alt,
  className,
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  if (!src) {
    return (
      <div 
        className={cn(
          'w-full h-48 bg-gradient-to-br from-slate-800 to-slate-700',
          'flex items-center justify-center rounded-lg',
          className
        )}
      >
        <svg 
          className="w-16 h-16 text-slate-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" 
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative w-full h-48 overflow-hidden rounded-lg', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        objectFit="cover"
      />
    </div>
  )
}