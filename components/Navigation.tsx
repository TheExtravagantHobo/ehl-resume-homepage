// components/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Briefcase, Mail, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface NavigationProps {
  showBackButton?: boolean
}

export default function Navigation({ showBackButton = false }: NavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-brand-navy/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Back button or empty */}
          <div className="flex items-center">
            {showBackButton && (
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-brand-orange transition-colors duration-300"
                title="Back to Home"
              >
                <ArrowLeft size={20} />
              </Link>
            )}
          </div>

          {/* Center - Navigation Links */}
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-6 sm:space-x-8 px-2">
              <Link
                href="/resume"
                className={`${
                  isActive('/resume')
                    ? 'text-brand-orange font-semibold'
                    : 'text-brand-navy dark:text-gray-300 hover:text-brand-orange'
                } transition-all duration-300 flex items-center gap-2 whitespace-nowrap`}
              >
                <FileText size={18} />
                <span>Resume</span>
              </Link>
              <Link
                href="/portfolio"
                className={`${
                  isActive('/portfolio')
                    ? 'text-brand-orange font-semibold'
                    : 'text-brand-navy dark:text-gray-300 hover:text-brand-orange'
                } transition-all duration-300 flex items-center gap-2 whitespace-nowrap`}
              >
                <Briefcase size={18} />
                <span>Portfolio</span>
              </Link>
              <a
                href="mailto:admin@example.com"
                className="text-brand-navy dark:text-gray-300 hover:text-brand-orange transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <Mail size={18} />
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Right side - Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}