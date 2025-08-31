// app/signin/page.tsx
'use client'
export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Separate component that uses useSearchParams
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
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-8">
      {/* Your existing form JSX here */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... rest of your form ... */}
      </form>
    </div>
  )
}

// Main page component with Suspense
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              The Extravagant Hobo
            </h1>
          </Link>
          <p className="text-gray-400 mt-2">Admin Access</p>
        </div>

        <Suspense fallback={
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 text-center">
            <Loader2 className="animate-spin mx-auto" size={24} />
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}