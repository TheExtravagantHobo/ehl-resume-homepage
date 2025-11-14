// app/portfolio/loading.tsx
import Link from 'next/link'
import { ArrowLeft, FileText, Briefcase, Mail } from 'lucide-react'
import { Button, Container, Section } from '@/components/ui'
import { PortfolioGridSkeleton } from '@/components/skeletons/PortfolioSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <Container>
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/resume">
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="ghost" size="sm" className="text-purple-400">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </Link>
              <a href="mailto:admin@example.com">
                <Button variant="ghost" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <Section spacing="sm">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Portfolio & Articles
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Exploring the intersection of technology, strategy, and innovation through research and thought leadership.
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Content - Skeleton */}
      <Section>
        <Container>
          <PortfolioGridSkeleton />
        </Container>
      </Section>
    </div>
  )
}
