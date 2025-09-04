// app/portfolio/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  ExternalLink,
  Calendar,
  Clock,
  Loader2,
  FileText,
  RefreshCw,
  Briefcase,
  Mail
} from 'lucide-react'

interface Article {
  id: string
  title: string
  subtitle?: string
  excerpt: string
  url: string
  ogImageUrl?: string
  publishedDate: string
  readTime?: string
  tags?: string[]
  order: number
}

export default function PortfolioPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching articles...')
      const response = await fetch('/api/portfolio', {
        // Add cache-busting to ensure fresh data
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Articles received:', data)
      console.log('Number of articles:', data.length)
      
      // Sort by order field
      const sortedData = data.sort((a: Article, b: Article) => a.order - b.order)
      setArticles(sortedData)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError(error instanceof Error ? error.message : 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // Get all unique tags
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags || []))
  )

  // Filter articles by tag
  const filteredArticles = selectedTag 
    ? articles.filter(article => article.tags?.includes(selectedTag))
    : articles

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      console.error('Date formatting error:', e)
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/resume" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <FileText size={18} />
                Resume
              </Link>
              <Link href="/portfolio" className="text-purple-400 flex items-center gap-2">
                <Briefcase size={18} />
                Portfolio
              </Link>
              <a href="mailto:admin@sitename.com" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <Mail size={18} />
                Contact
              </a>
              <button
                onClick={fetchArticles}
                className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
                title="Refresh articles"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Thought Leadership
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Insights on AI/ML, defense technology, strategic leadership, and innovation
          </p>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-sm text-gray-500">
              Total articles loaded: {articles.length}
            </div>
          )}
        </motion.div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
            <p>Error loading articles: {error}</p>
            <button
              onClick={fetchArticles}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-2 justify-center"
          >
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg transition-all ${
                !selectedTag 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              All Topics ({articles.length})
            </button>
            {allTags.map(tag => {
              const tagCount = articles.filter(a => a.tags?.includes(tag)).length
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedTag === tag 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {tag} ({tagCount})
                </button>
              )
            })}
          </motion.div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group block bg-slate-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                {/* OG Image */}
                <div className="relative w-full aspect-[1200/630] bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                  {article.ogImageUrl ? (
                    <img 
                      src={article.ogImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <span>Read on LinkedIn</span>
                      <ExternalLink size={20} />
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>

                  {/* Subtitle */}
                  {article.subtitle && (
                    <p className="text-gray-400 mb-3">
                      {article.subtitle}
                    </p>
                  )}

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {article.publishedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(article.publishedDate)}
                      </span>
                    )}
                    {article.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {selectedTag 
                ? `No articles found for "${selectedTag}"`
                : 'No articles published yet. Check back soon!'}
            </p>
          </div>
        )}

        {/* Footer CTA */}
        {articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-400 mb-4">
              Want to connect and discuss these topics?
            </p>
            <a
              href="https://www.linkedin.com/in/profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Follow on LinkedIn
              <ExternalLink size={18} />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}