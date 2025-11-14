// app/loading.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { ShowcaseGridSkeleton } from '@/components/skeletons/ShowcaseSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section - Renders immediately */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Name
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/resume" className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                View Resume
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <a href="mailto:admin@example.com" className="px-6 py-3 border-2 border-purple-600 text-purple-400 rounded-lg hover:bg-purple-950 transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Showcase Cards Skeleton */}
          <div className="mt-32">
            <ShowcaseGridSkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}
