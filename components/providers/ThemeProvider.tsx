'use client'
// components/providers/ThemeProvider.tsx



import React, { createContext, useContext, useEffect, useState } from 'react'
import { themes, type Theme } from '@/lib/design-system'

// ============================================
// TYPE DEFINITIONS
// ============================================
type ThemeMode = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

// ============================================
// THEME CONTEXT
// ============================================
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ============================================
// THEME PROVIDER COMPONENT
// ============================================
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [theme, setTheme] = useState<Theme>(themes.dark)
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)
    
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode | null
    
    if (savedTheme) {
      setThemeMode(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Default to dark theme
      setThemeMode('dark')
      applyTheme('dark')
    }
  }, [])

  // Apply theme changes
  useEffect(() => {
    if (mounted) {
      applyTheme(themeMode)
      localStorage.setItem('theme-mode', themeMode)
    }
  }, [themeMode, mounted])

  // Function to apply theme
  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light')
    
    // Determine actual theme based on mode
    let actualTheme: 'dark' | 'light' = 'dark'
    
    if (mode === 'system') {
      // Check system preference
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      actualTheme = mode
    }
    
    // Apply theme class to root
    root.classList.add(actualTheme)
    
    // Update theme object
    setTheme(actualTheme === 'dark' ? themes.dark : themes.dark) // Use themes.light when implemented
    
    // Set CSS variables for runtime access
    setCSSVariables(actualTheme === 'dark' ? themes.dark : themes.dark)
  }

  // Set CSS custom properties for theme colors
  const setCSSVariables = (currentTheme: Theme) => {
    const root = document.documentElement
    
    // Set background colors
    root.style.setProperty('--color-bg-primary', currentTheme.colors.background.secondary)
    root.style.setProperty('--color-bg-secondary', currentTheme.colors.background.tertiary)
    
    // Set text colors
    root.style.setProperty('--color-text-primary', currentTheme.colors.text.primary)
    root.style.setProperty('--color-text-secondary', currentTheme.colors.text.secondary)
    root.style.setProperty('--color-text-muted', currentTheme.colors.text.muted)
    
    // Set border colors
    root.style.setProperty('--color-border-primary', currentTheme.colors.border.primary)
    root.style.setProperty('--color-border-secondary', currentTheme.colors.border.secondary)
    
    // Set accent colors (for CSS-only animations)
    root.style.setProperty('--color-accent-purple', '#a855f7')
    root.style.setProperty('--color-accent-blue', '#3b82f6')
  }

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'dark') return 'light'
      if (prev === 'light') return 'dark'
      // If system, toggle to opposite of current system preference
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isSystemDark ? 'light' : 'dark'
    })
  }

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = () => {
        applyTheme('system')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [themeMode])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================
// CUSTOM HOOK
// ============================================
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// ============================================
// THEME TOGGLE COMPONENT
// ============================================
export function ThemeToggle() {
  const { themeMode, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {themeMode === 'dark' ? (
        // Sun icon for light mode
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  )
}