'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700">
      <button
        onClick={() => setTheme('light')}
        className={`p-1 rounded-full transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-brand-orange'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title="Light mode"
      >
        <Sun size={12} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1 rounded-full transition-all duration-300 ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-brand-orange'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title="System preference"
      >
        <Monitor size={12} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-brand-orange'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title="Dark mode"
      >
        <Moon size={12} />
      </button>
    </div>
  )
}
