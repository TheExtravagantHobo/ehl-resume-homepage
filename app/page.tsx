// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, FileText, Briefcase, Mail, ExternalLink, Loader2 } from 'lucide-react'

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

export default function LandingPage() {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const response = await fetch('/api/showcase')
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
            linkUrl: 'mailto:admin@sitename.com',
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
    const className = "group block bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] overflow-hidden cursor-pointer"
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo or brand - empty for now */}
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/resume" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <FileText size={18} />
                Resume
              </Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <Briefcase size={18} />
                Portfolio
              </Link>
              <a href="mailto:admin@sitename.com" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <Mail size={18} />
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Name Name
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/resume" className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                View Resume
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <a href="mailto:admin@sitename.com" className="px-6 py-3 border-2 border-purple-600 text-purple-400 rounded-lg hover:bg-purple-950 transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Showcase Cards */}
          <div className="mt-32">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showcaseItems.map((item) => (
                  <div key={item.id}>
                    {renderShowcaseLink(item, (
                      <>
                        {/* Image Section - 1200x630 aspect ratio */}
                        <div className="relative w-full aspect-[1200/630] bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
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
                          <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}