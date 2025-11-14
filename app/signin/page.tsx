'use client'

// app/signin/page.tsx

import { Suspense } from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-center w-12 h-12 bg-brand-orange rounded-full mx-auto mb-6">
        <Lock className="text-white" size={24} />
      </div>

      <h2 className="text-2xl font-bold text-brand-navy dark:text-white text-center mb-6">Sign In</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-navy dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-brand-navy dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
              placeholder="admin@example.com"
              disabled={loading}
            />
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand-navy dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-brand-navy dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
              placeholder="••••••••"
              disabled={loading}
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-brand-orange text-white font-medium rounded-lg hover:bg-brand-orange-light hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-colors duration-300">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-navy flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-brand-navy dark:text-white">
              Resume Portfolio
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Admin Access</p>
        </div>

        <Suspense fallback={
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-slate-700">
            <Loader2 className="animate-spin mx-auto text-brand-orange" size={24} />
          </div>
        }>
          <SignInForm />
        </Suspense>

        <p className="text-center text-gray-500 dark:text-gray-600 text-xs mt-6">
          This is a secure area. Only authorized administrators can access.
        </p>
      </div>
    </div>
  )
}