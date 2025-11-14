// app/not-found.tsx

'use client'

import Link from 'next/link';
import { Home, FileText, Briefcase, BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-navy text-brand-navy dark:text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Error Code with gradient effect */}
        <div className="mb-8">
          <div className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-brand-orange via-brand-orange-light to-slate-700 bg-clip-text text-transparent">
            404
          </div>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent mt-4" />
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <div className="text-2xl sm:text-3xl font-semibold mb-4 text-brand-navy dark:text-white">
            Page Not Found
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist.
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12 max-w-lg mx-auto">
          <Link
            href="/"
            className="group flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-brand-orange hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <Home className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" />
            <div className="text-left">
              <div className="font-semibold text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">
                Home
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-600">Back to portfolio</div>
            </div>
          </Link>

          <Link
            href="/resume"
            className="group flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-brand-orange hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" />
            <div className="text-left">
              <div className="font-semibold text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">
                Resume
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-600">View experience</div>
            </div>
          </Link>

          <Link
            href="/portfolio"
            className="group flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-brand-orange hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" />
            <div className="text-left">
              <div className="font-semibold text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">
                Portfolio
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-600">See my work</div>
            </div>
          </Link>
        </div>

        {/* Alternative Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-brand-navy dark:text-white rounded-lg hover:border-brand-orange hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <span className="text-gray-600 dark:text-gray-500">or</span>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-light hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span className="font-semibold">Go Home</span>
          </Link>
        </div>

        {/* Footer Message */}
        <div className="mt-16 text-sm text-gray-500 dark:text-gray-600">
          <p>
            Error Code: 404 • If you believe this is a mistake, please{' '}
            <a
              href="mailto:admin@example.com"
              className="text-brand-orange underline hover:text-brand-orange-light transition-colors"
            >
              let me know
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}