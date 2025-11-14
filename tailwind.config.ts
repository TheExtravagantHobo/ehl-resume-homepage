// tailwind.config.ts

import type { Config } from 'tailwindcss'
import { colors, typography, spacing, animations, shadows, radii } from './lib/design-system'

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode for next-themes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}', // Include design system
  ],
  theme: {
    // Override default theme completely for consistency
    colors: {
      // Expose all color scales from design system
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      slate: colors.slate,
      gray: colors.gray,
      purple: colors.purple,
      blue: colors.blue,
      green: colors.success,
      yellow: colors.warning,
      red: colors.error,
      // Semantic colors for easier use
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
    },
    spacing: {
      ...spacing,
    },
    fontSize: {
      ...typography.sizes,
    },
    fontWeight: {
      ...typography.weights,
    },
    lineHeight: {
      ...typography.lineHeights,
    },
    fontFamily: {
      sans: typography.fonts.sans.split(','),
      serif: typography.fonts.serif.split(','),
      mono: typography.fonts.mono.split(','),
    },
    borderRadius: {
      ...radii,
    },
    boxShadow: {
      ...shadows,
    },
    extend: {
      // Custom animations
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'slideInLeft': 'slideInLeft 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)' },
        },
      },
      // Transition durations from design system
      transitionDuration: {
        ...animations.durations,
      },
      // Transition timing functions
      transitionTimingFunction: {
        ...animations.easings,
      },
      // Z-index scale
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'auto': 'auto',
      },
      // Background gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, rgb(168 85 247), rgb(59 130 246))',
        'gradient-secondary': 'linear-gradient(to right, rgb(147 51 234), rgb(37 99 235))',
        'gradient-dark': 'linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))',
      },
      // Grid template columns
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      // Additional breakpoints if needed
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      // Backdrop filters
      backdropBlur: {
        xs: '2px',
      },
      // Custom content for pseudo elements
      content: {
        'empty': '""',
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
  // Important settings for production
  future: {
    hoverOnlyWhenSupported: true, // Better mobile experience
  },
}

export default config