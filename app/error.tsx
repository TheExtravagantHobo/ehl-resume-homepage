// app/error.tsx
'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCcw, AlertTriangle, Mail, FileText, Briefcase } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white dark:bg-brand-navy text-brand-navy dark:text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon and Code */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
              <AlertTriangle className="relative w-24 h-24 text-red-400" />
            </div>
          </div>
          <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Oops!
          </div>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-red-600/50 to-transparent mt-4" />
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-brand-navy dark:text-white">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto mb-4">
            An unexpected error occurred while processing your request.
            Don&apos;t worry, we can help you get back on track.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-left max-w-lg mx-auto">
              <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-light hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            type="button"
          >
            <RefreshCcw className="w-4 h-4" />
            <span className="font-semibold">Try Again</span>
          </button>

          <span className="text-gray-600 dark:text-gray-500">or</span>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-brand-navy dark:text-white rounded-lg hover:border-brand-orange hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Quick Navigation Grid */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-600 mb-6">Or navigate to:</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <Link
              href="/resume"
              className="group flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-brand-orange hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors">
                Resume
              </span>
            </Link>

            <Link
              href="/portfolio"
              className="group flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-brand-orange hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors">
                Portfolio
              </span>
            </Link>

            <a
              href="mailto:admin@example.com"
              className="group flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-brand-orange hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors">
                Contact
              </span>
            </a>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-600">
          <p>
            If this error persists, please{' '}
            <a
              href="mailto:admin@example.com"
              className="text-brand-orange underline hover:text-brand-orange-light transition-colors"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}