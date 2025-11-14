// lib/design-system.ts

/**
 * Centralized Design System
 * All design tokens and theme configuration in one place
 * Production-ready, type-safe, and maintainable
 */

// ============================================
// COLOR PALETTE
// ============================================
export const colors = {
    // Base colors
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Semantic colors
    success: {
      light: '#86efac',
      DEFAULT: '#22c55e',
      dark: '#16a34a',
    },
    warning: {
      light: '#fed7aa',
      DEFAULT: '#f97316',
      dark: '#ea580c',
    },
    error: {
      light: '#fecaca',
      DEFAULT: '#ef4444',
      dark: '#dc2626',
    },
    info: {
      light: '#bfdbfe',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
    },
  } as const
  
  // ============================================
  // TYPOGRAPHY
  // ============================================
  export const typography = {
    fonts: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Georgia, Cambria, serif',
      mono: 'Menlo, Monaco, Courier New, monospace',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  } as const
  
  // ============================================
  // SPACING SCALE
  // ============================================
  export const spacing = {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    2: '0.5rem',      // 8px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
  } as const
  
  // ============================================
  // BREAKPOINTS
  // ============================================
  export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  } as const
  
  // ============================================
  // ANIMATIONS
  // ============================================
  export const animations = {
    durations: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  } as const
  
  // ============================================
  // SHADOWS
  // ============================================
  export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  } as const
  
  // ============================================
  // BORDER RADIUS
  // ============================================
  export const radii = {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  } as const
  
  // ============================================
  // Z-INDEX SCALE
  // ============================================
  export const zIndices = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    notification: 70,
  } as const
  
  // ============================================
  // THEME CONFIGURATIONS
  // ============================================
  export const themes = {
    dark: {
      name: 'Dark Modern',
      colors: {
        // Backgrounds
        background: {
          primary: 'from-slate-900 to-slate-800',
          secondary: colors.slate[800],
          tertiary: colors.slate[700],
          overlay: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity
        },
        // Text
        text: {
          primary: '#ffffff',
          secondary: colors.gray[400],
          muted: colors.gray[500],
          disabled: colors.gray[600],
        },
        // Accents
        accent: {
          primary: 'from-purple-500 to-blue-500',
          secondary: 'from-purple-600 to-blue-600',
          hover: 'from-purple-400 to-blue-400',
        },
        // Interactive elements
        interactive: {
          hover: colors.slate[700],
          active: colors.slate[600],
          disabled: colors.slate[800],
        },
        // Borders
        border: {
          primary: colors.slate[700],
          secondary: colors.slate[600],
          focus: colors.purple[500],
        },
        // Status colors
        status: {
          success: colors.success.DEFAULT,
          warning: colors.warning.DEFAULT,
          error: colors.error.DEFAULT,
          info: colors.info.DEFAULT,
        },
        // Special elements
        timeline: {
          line: colors.slate[600],
          dot: colors.purple[500],
          activeDot: colors.blue[500],
        },
      },
    },
    // Add light theme when needed
    light: {
      name: 'Light Modern',
      colors: {
        // To be implemented when light mode is added
      },
    },
  } as const
  
  // ============================================
  // TAILWIND CLASS COMPOSITIONS
  // ============================================
  export const components = {
    // Card styles
    card: {
      base: 'rounded-xl border transition-all duration-300',
      dark: `bg-slate-800 border-slate-700 hover:border-slate-600`,
      light: `bg-white border-gray-200 hover:border-gray-300`,
    },
    // Button styles
    button: {
      base: 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105',
      primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500',
      secondary: 'bg-slate-700 text-white hover:bg-slate-600',
      outline: 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white',
      disabled: 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50',
    },
    // Input styles
    input: {
      base: 'w-full px-4 py-2 rounded-lg transition-all duration-200',
      dark: 'bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
      light: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
    },
    // Container styles
    container: {
      base: 'mx-auto px-4 sm:px-6 lg:px-8',
      maxWidth: 'max-w-7xl',
    },
    // Section styles
    section: {
      base: 'py-16 sm:py-20 lg:py-24',
      compact: 'py-8 sm:py-12 lg:py-16',
    },
    // Grid layouts
    grid: {
      base: 'grid gap-6',
      cols1: 'grid-cols-1',
      cols2: 'sm:grid-cols-2',
      cols3: 'lg:grid-cols-3',
      cols4: 'xl:grid-cols-4',
    },
    // Flex layouts
    flex: {
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      start: 'flex items-start',
      end: 'flex items-end justify-end',
      col: 'flex flex-col',
    },
    // Text styles
    text: {
      h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
      h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold',
      h3: 'text-2xl sm:text-3xl font-semibold',
      h4: 'text-xl sm:text-2xl font-semibold',
      body: 'text-base lg:text-lg',
      small: 'text-sm lg:text-base',
      caption: 'text-xs lg:text-sm',
    },
    // Animation classes
    animation: {
      fadeIn: 'animate-fadeIn',
      slideUp: 'animate-slideUp',
      slideDown: 'animate-slideDown',
      bounce: 'animate-bounce',
      pulse: 'animate-pulse',
      spin: 'animate-spin',
    },
  } as const
  
  // ============================================
  // TYPE EXPORTS
  // ============================================
  export type Theme = typeof themes.dark
  export type ThemeColors = Theme['colors']
  export type ColorKey = keyof typeof colors
  export type SpacingKey = keyof typeof spacing
  export type TypographySize = keyof typeof typography.sizes
  export type AnimationDuration = keyof typeof animations.durations
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  /**
   * Get the current theme based on user preference or system setting
   */
  export function getCurrentTheme(): Theme {
    // For now, always return dark theme
    // Later, this can check localStorage or system preferences
    return themes.dark
  }
  
  /**
   * Generate Tailwind classes for a gradient background
   */
  export function getGradientClasses(from: string, to: string, direction = 'r'): string {
    return `bg-gradient-to-${direction} from-${from} to-${to}`
  }
  
  /**
   * Combine multiple class names conditionally
   */
  export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
  }
  
  // ============================================
  // DEFAULT EXPORT
  // ============================================
  const designSystem = {
    colors,
    typography,
    spacing,
    breakpoints,
    animations,
    shadows,
    radii,
    zIndices,
    themes,
    components,
    // Utility functions
    getCurrentTheme,
    getGradientClasses,
    cn,
  }
  
  export default designSystem