// app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Briefcase, Mail, Settings } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function LandingPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                The Extravagant Hobo
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/resume" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2">
                <FileText size={18} />
                Resume
              </Link>
              <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2">
                <Briefcase size={18} />
                Portfolio
              </Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2">
                <Mail size={18} />
                Contact
              </Link>
              
              {/* Admin Link - shows different states based on auth */}
              {status === 'loading' ? (
                <span className="text-gray-400 text-sm">...</span>
              ) : session ? (
                <div className="flex items-center gap-4 border-l pl-8 ml-4 border-gray-300 dark:border-gray-700">
                  <Link href="/admin" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2">
                    <Settings size={18} />
                    Admin
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-gray-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Alex Sonne
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/resume" className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                View Resume
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link href="/contact" className="px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950 transition-all duration-300">
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-32">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Interactive Resume</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore my experience with an engaging, interactive timeline and expandable details.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Portfolio</h3>
              <p className="text-gray-600 dark:text-gray-400">
                View my projects spanning AI/ML, defense technology, and strategic consulting.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Connect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Let's discuss how I can contribute to your organization's success.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}