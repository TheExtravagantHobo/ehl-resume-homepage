// app/admin/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'  // Use NextAuth signOut
import { Save, LogOut, User, Briefcase, GraduationCap, Code, FileText, Globe, Award, BookOpen, Grid, Settings } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// Import shared components
import { AdminHeader } from './components/AdminHeader'
import { AdminSidebar } from './components/AdminSidebar'

// Import tab components
import { PersonalInfoTab } from './components/tabs/PersonalInfoTab'
import { ExperienceTab } from './components/tabs/ExperienceTab'
import { EducationTab } from './components/tabs/EducationTab'
import { SkillsTab } from './components/tabs/SkillsTab'
import { PublicationsTab } from './components/tabs/PublicationsTab'
import { LanguagesTab } from './components/tabs/LanguagesTab'
import { CertificationsTab } from './components/tabs/CertificationsTab'
import { ArticlesTab } from './components/tabs/ArticlesTab'
import { ShowcaseTab } from './components/tabs/ShowcaseTab'
import { SettingsTab } from './components/tabs/SettingsTab'

// Import types
import type { ResumeData, ShowcaseItem } from '@/types/resume'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // State for all data
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    // Remove checkAuth() - NextAuth handles this via layout.tsx
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resumeRes, showcaseRes, articlesRes] = await Promise.all([
        fetch('/api/resume'),
        fetch('/api/showcase'),
        fetch('/api/portfolio')
      ])

      const resumeData = await resumeRes.json()
      const showcaseData = await showcaseRes.json()
      const articlesData = await articlesRes.json()

      // Convert ISO date strings to yyyy-mm-dd format for date inputs
      if (resumeData?.experiences) {
        resumeData.experiences = resumeData.experiences.map((exp: any) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : null,
        }))
      }

      if (resumeData?.certifications) {
        resumeData.certifications = resumeData.certifications.map((cert: any) => ({
          ...cert,
          certDate: cert.certDate ? new Date(cert.certDate).toISOString().split('T')[0] : '',
        }))
      }

      // Convert article dates to yyyy-mm-dd format for date inputs
      const formattedArticles = articlesData.map((article: any) => ({
        ...article,
        publishedDate: article.publishedDate ? new Date(article.publishedDate).toISOString().split('T')[0] : '',
      }))

      setResumeData(resumeData || getEmptyResumeData())
      setShowcaseItems(showcaseData || [])
      setArticles(formattedArticles || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setResumeData(getEmptyResumeData())
    } finally {
      setLoading(false)
    }
  }

  const getEmptyResumeData = (): ResumeData => ({
    id: 'default',
    name: '',
    title: '',
    bio: '',
    email: '',
    signalUrl: '',
    linkedinPersonal: '',
    linkedinBusiness: '',
    photoUrl: null,
    showMission: false,
    missionTitle: 'Mission',
    missionText: '',
    experiences: [],
    education: [],
    skills: [],
    publications: [],
    languages: [],
    certifications: [],
    articles: []
  })

  const handleSave = async () => {
    setSaving(true)

    try {
      console.log('[AdminPage] Saving showcase items:', showcaseItems)

      // Save resume data
      await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      })

      // Save showcase items
      await fetch('/api/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(showcaseItems)
      })

      // Save articles
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articles)
      })

      setHasChanges(false)
      toast.success('Changes saved')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Error saving changes')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    // Use NextAuth signOut instead of sessionStorage
    await signOut({ callbackUrl: '/' })
  }

  const updateResumeData = (updates: Partial<ResumeData>) => {
    if (resumeData) {
      setResumeData({ ...resumeData, ...updates })
      setHasChanges(true)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'publications', label: 'Publications', icon: FileText },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'showcase', label: 'Showcase', icon: Grid },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (loading || !resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <AdminHeader
        hasChanges={hasChanges}
        saving={saving}
        onSave={handleSave}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <AdminSidebar 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === 'personal' && resumeData && (
              <PersonalInfoTab
                data={resumeData}
                onChange={updateResumeData}
              />
            )}

            {activeTab === 'experience' && resumeData && (
              <ExperienceTab
                experiences={resumeData.experiences || []}
                onChange={(experiences) => updateResumeData({ experiences })}
              />
            )}

            {activeTab === 'education' && resumeData && (
              <EducationTab
                education={resumeData.education || []}
                onChange={(education) => updateResumeData({ education })}
              />
            )}

            {activeTab === 'skills' && resumeData && (
              <SkillsTab
                skills={resumeData.skills || []}
                onChange={(skills) => updateResumeData({ skills })}
              />
            )}

            {activeTab === 'publications' && resumeData && (
              <PublicationsTab
                publications={resumeData.publications || []}
                onChange={(publications) => updateResumeData({ publications })}
              />
            )}

            {activeTab === 'languages' && resumeData && (
              <LanguagesTab
                languages={resumeData.languages || []}
                onChange={(languages) => updateResumeData({ languages })}
              />
            )}

            {activeTab === 'certifications' && resumeData && (
              <CertificationsTab
                certifications={resumeData.certifications || []}
                onChange={(certifications) => updateResumeData({ certifications })}
              />
            )}

            {activeTab === 'articles' && (
              <ArticlesTab
                articles={articles}
                onChange={(updatedArticles) => {
                  setArticles(updatedArticles)
                  setHasChanges(true)
                }}
              />
            )}

            {activeTab === 'showcase' && (
              <ShowcaseTab
                showcaseItems={showcaseItems}
                onChange={(items) => {
                  console.log('[AdminPage] Showcase onChange called with:', items)
                  setShowcaseItems(items)
                  setHasChanges(true)
                }}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}