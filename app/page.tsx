// app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Briefcase, Mail } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Empty for now - you can add logo or other content later */}
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
              <a href="mailto:admin@theextravaganthobo.com" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <Mail size={18} />
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - rest stays the same */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Alex Sonne
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
              <a href="mailto:admin@theextravaganthobo.com" className="px-6 py-3 border-2 border-purple-600 text-purple-400 rounded-lg hover:bg-purple-950 transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-32">
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Interactive Resume</h3>
              <p className="text-gray-400">
                Explore my experience with an engaging, interactive timeline and expandable details.
              </p>
            </div>
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Portfolio</h3>
              <p className="text-gray-400">
                View my projects spanning AI/ML, defense technology, and strategic consulting.
              </p>
            </div>
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Connect</h3>
              <p className="text-gray-400">
                Let's discuss how I can contribute to your organization's success.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}