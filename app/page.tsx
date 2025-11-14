// app/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Briefcase, Mail, ExternalLink } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { ShowcaseGridSkeleton } from '@/components/skeletons/ShowcaseSkeleton'

interface ShowcaseItem {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  linkUrl: string
  linkType: string
  order: number
  isActive: boolean
}

function ShowcaseCards() {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        // Use Next.js fetch with caching for better performance
        const response = await fetch('/api/showcase', {
          next: { revalidate: 3600 } // Cache for 1 hour
        })
        const data = await response.json()
        setShowcaseItems(data)
      } catch (error) {
        console.error('Error fetching showcase items:', error)
        // Fallback to default items if fetch fails
        setShowcaseItems([
          {
            id: 'default-1',
            title: 'Interactive Resume',
            description: 'Explore my experience with an engaging, interactive timeline and expandable details.',
            imageUrl: null,
            linkUrl: '/resume',
            linkType: 'internal',
            order: 0,
            isActive: true
          },
          {
            id: 'default-2',
            title: 'Portfolio',
            description: 'View my projects spanning AI/ML, defense technology, and strategic consulting.',
            imageUrl: null,
            linkUrl: '/portfolio',
            linkType: 'internal',
            order: 1,
            isActive: true
          },
          {
            id: 'default-3',
            title: 'Connect',
            description: "Let's discuss how I can contribute to your organization's success.",
            imageUrl: null,
            linkUrl: 'mailto:admin@example.com',
            linkType: 'mailto',
            order: 2,
            isActive: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchShowcase()
  }, [])

  const renderShowcaseLink = (item: ShowcaseItem, children: React.ReactNode) => {
    const className = "group block bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 overflow-hidden cursor-pointer border border-gray-200 dark:border-slate-700"

    if (item.linkType === 'mailto') {
      return (
        <a href={item.linkUrl} className={className}>
          {children}
        </a>
      )
    } else if (item.linkType === 'external') {
      return (
        <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      )
    } else {
      return (
        <Link href={item.linkUrl} className={className}>
          {children}
        </Link>
      )
    }
  }

  if (loading) {
    return <ShowcaseGridSkeleton />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {showcaseItems
        .filter(item => item.isActive)
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <div key={item.id}>
            {renderShowcaseLink(item, (
              <>
                {/* Image Section - 16:9 aspect ratio */}
                <div className="relative w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // Fallback gradient if image fails
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Default icon based on title */}
                      {item.title.toLowerCase().includes('resume') && <FileText className="text-white/30" size={48} />}
                      {item.title.toLowerCase().includes('portfolio') && <Briefcase className="text-white/30" size={48} />}
                      {item.title.toLowerCase().includes('connect') && <Mail className="text-white/30" size={48} />}
                      {!item.title.toLowerCase().includes('resume') &&
                       !item.title.toLowerCase().includes('portfolio') &&
                       !item.title.toLowerCase().includes('connect') &&
                       <ExternalLink className="text-white/30" size={48} />}
                    </div>
                  )}

                  {/* Hover Overlay for external links */}
                  {item.linkType === 'external' && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="text-white" size={32} />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </>
            ))}
          </div>
        ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-navy">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-brand-navy dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Your Name
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/resume" className="group px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-light hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                View Resume
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
              </Link>
              <a href="mailto:admin@example.com" className="px-6 py-3 border-2 border-brand-navy dark:border-white text-brand-navy dark:text-white rounded-lg hover:bg-brand-navy hover:text-white dark:hover:bg-white dark:hover:text-brand-navy transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Showcase Cards with Suspense */}
          <div className="mt-32">
            <Suspense fallback={<ShowcaseGridSkeleton />}>
              <ShowcaseCards />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}