// app/resume/loading.tsx
import Link from 'next/link'
import { ArrowLeft, FileText, Briefcase, Mail, GraduationCap, Code } from 'lucide-react'
import { Skeleton } from '@/components/ui'

const theme = {
  bg: 'bg-gradient-to-br from-slate-900 to-slate-800',
  card: 'bg-slate-800',
  text: 'text-white',
  subtext: 'text-gray-400',
  timeline: 'bg-slate-600',
}

export default function Loading() {
  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Navigation Header */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/resume" className="text-purple-400 flex items-center gap-2">
                <FileText size={18} />
                Resume
              </Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <Briefcase size={18} />
                Portfolio
              </Link>
              <a href="mailto:admin@example.com" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <Mail size={18} />
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section Skeleton */}
        <div className={`${theme.card} rounded-2xl shadow-xl p-8 mb-8`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <Skeleton variant="circular" width={128} height={128} />
              <div className="space-y-3">
                <Skeleton variant="text" width={300} height={40} />
                <Skeleton variant="text" width={250} height={24} />
                <Skeleton variant="text" width={400} height={20} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={80} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Education Column */}
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <GraduationCap size={24} />
              Education
            </h2>
            <div className="relative">
              <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme.timeline}`} />
              {[1, 2].map((i) => (
                <div key={i} className="relative pl-12 pb-8">
                  <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
                  <div className={`${theme.card} p-4 rounded-lg shadow-md`}>
                    <Skeleton variant="text" width="90%" height={20} className="mb-2" />
                    <Skeleton variant="text" width="80%" className="mb-1" />
                    <Skeleton variant="text" width="85%" className="mb-1" />
                    <Skeleton variant="text" width="70%" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <Code size={24} />
              Skills
            </h2>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <Skeleton variant="text" width={120} />
                </div>
                <Skeleton variant="rectangular" height={12} className="rounded-full" />
              </div>
            ))}
          </div>

          {/* Experience Column */}
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <Briefcase size={24} />
              Experience
            </h2>
            <div className="relative">
              <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme.timeline}`} />
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
                  </div>
                  <div className={`${theme.card} p-4 rounded-lg shadow-md`}>
                    <Skeleton variant="text" width={100} className="mb-1" />
                    <Skeleton variant="text" width="90%" height={20} className="mb-2" />
                    <Skeleton variant="text" width="80%" className="mb-2" />
                    <div className="space-y-1">
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="95%" />
                      <Skeleton variant="text" width="85%" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}