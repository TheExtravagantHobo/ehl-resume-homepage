'use client'
// app/portfolio/page.tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import {
  ExternalLink,
  Calendar,
  Clock,
  RefreshCw,
  FileText
} from 'lucide-react'
import {
  Button,
  Card,
  Container,
  Section,
  Spinner,
  Alert,
  Badge
} from '@/components/ui'
import { themes, cn } from '@/lib/design-system'

// ============================================
// TYPES
// ============================================
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

// White canvas theme
const theme = {
  bg: 'bg-white dark:bg-brand-navy',
  text: 'text-brand-navy dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-300',
  textMuted: 'text-gray-400 dark:text-gray-500',
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PortfolioPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const response = await fetch('/api/portfolio', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const sortedData = data.sort((a: Article, b: Article) => a.order - b.order)
      setArticles(sortedData)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError(error instanceof Error ? error.message : 'Failed to load articles')
    } finally {
      setLoading(false)
      setRefreshing(false)
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
    <div className="min-h-screen bg-white dark:bg-brand-navy">
      {/* Header Navigation */}
      <Navigation showBackButton />

      {/* Hero Section */}
      <Section spacing="sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
                Portfolio & Articles
              </h1>
              <Button
                onClick={() => fetchArticles(true)}
                variant="ghost"
                size="sm"
                disabled={refreshing}
                title="Refresh articles"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-orange"
              >
                <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
              </Button>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Exploring the intersection of technology, strategy, and innovation through research and thought leadership.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <Section spacing="sm">
          <Container>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => setSelectedTag(null)}
                variant={selectedTag === null ? "primary" : "secondary"}
                size="sm"
              >
                All Articles
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  variant={selectedTag === tag ? "primary" : "secondary"}
                  size="sm"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Main Content */}
      <Section>
        <Container>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error" title="Error Loading Articles">
              {error}
              <Button
                onClick={() => fetchArticles()}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Try Again
              </Button>
            </Alert>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-brand-navy dark:text-white mb-2">
                {selectedTag ? 'No articles found with this tag' : 'No Articles Yet'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedTag
                  ? 'Try selecting a different tag or view all articles.'
                  : 'Check back soon for new content!'}
              </p>
              {selectedTag && (
                <Button
                  onClick={() => setSelectedTag(null)}
                  variant="primary"
                  size="sm"
                  className="mt-4"
                >
                  View All Articles
                </Button>
              )}
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="h-full flex flex-col group bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 rounded-lg overflow-hidden p-6">
                      {article.ogImageUrl && (
                        <div className="relative mb-4 overflow-hidden rounded-lg">
                          <img
                            src={article.ogImageUrl}
                            alt={article.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col">
                        <h2 className="text-xl font-semibold text-brand-navy dark:text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                          {article.title}
                        </h2>

                        {article.subtitle && (
                          <p className="text-brand-orange text-sm mb-3">
                            {article.subtitle}
                          </p>
                        )}

                        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500 mb-3">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(article.publishedDate)}
                            </span>
                            {article.readTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                              </span>
                            )}
                          </div>
                          <ExternalLink className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map(tag => (
                              <Badge
                                key={tag}
                                variant="default"
                                size="sm"
                                className="group-hover:bg-brand-orange/20 group-hover:text-brand-orange transition-colors duration-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                </motion.article>
              ))}
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Stats Section */}
      {articles.length > 0 && (
        <Section spacing="sm">
          <Container>
            <div className="text-center text-gray-600">
              <p>
                Showing {filteredArticles.length} of {articles.length} articles
                {selectedTag && ` tagged with "${selectedTag}"`}
              </p>
            </div>
          </Container>
        </Section>
      )}
    </div>
  )
}