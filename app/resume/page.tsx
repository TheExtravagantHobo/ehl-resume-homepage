// app/resume/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import {
  Mail,
  MessageCircle,
  Linkedin,
  ChevronRight,
  X,
  Building,
  GraduationCap,
  Code,
  FileText,
  Globe,
  Briefcase,
  Award,
  ExternalLink
} from 'lucide-react'

// Types
interface Experience {
  id: string
  dateRange?: string  // Keep for compatibility
  jobTitle: string
  company: string
  duties: string[]
  fullBullets: string[]
  workLocation?: string | null
  startDate?: string
  endDate?: string | null
  isCurrent?: boolean
}

interface Education {
  id: string
  schoolName: string
  degree: string
  major: string
  location: string
  yearsAttended: string
}

interface Skill {
  id: string
  name: string
  level: number
  hoverText: string
}

interface Publication {
  id: string
  title: string
  year: string
}

interface Language {
  id: string
  name: string
  proficiency: string
}

interface Certification {
  id: string
  name: string
  agency: string
  certNumber?: string
  certDate: string
  agencyUrl?: string
  iconUrl?: string
}

// Modern slate theme with orange accents
const theme = {
  bg: 'bg-white dark:bg-brand-navy',
  heroGradient: 'bg-gradient-to-r from-slate-800 to-slate-700',
  card: 'bg-slate-50 dark:bg-slate-800',
  cardShadow: 'shadow-sm hover:shadow-md dark:shadow-slate-900/50',
  cardBorder: 'border border-gray-200 dark:border-slate-700',
  cardHover: 'hover:scale-[1.01] hover:shadow-md transition-all duration-300',
  text: 'text-brand-navy dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-300',
  textMuted: 'text-gray-400 dark:text-gray-500',
  accent: 'from-slate-700 via-brand-orange-light to-brand-orange',
  border: 'border-gray-200 dark:border-slate-700',
  timeline: 'bg-gray-300 dark:bg-slate-600',
  dot: 'bg-brand-orange shadow-lg shadow-brand-orange/50',
  headerText: 'text-white',
  modalOverlay: 'bg-brand-navy/70 dark:bg-black/80',
  collapsibleHeader: 'bg-slate-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700',
  collapsibleContent: 'bg-white dark:bg-slate-800',
}

// Helper function to format date range
const formatDateRange = (exp: Experience): string => {
  // First priority: use dateRange if it exists
  if (exp.dateRange) return exp.dateRange
  
  // Second priority: calculate from dates
  if (exp.startDate) {
    const startYear = new Date(exp.startDate).getFullYear()
    if (exp.isCurrent) {
      return `${startYear} - Present`
    } else if (exp.endDate) {
      const endYear = new Date(exp.endDate).getFullYear()
      return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`
    }
    return `${startYear}`
  }
  
  // Fallback
  return ''
}

export default function ResumePage() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [isInitialMount, setIsInitialMount] = useState(true)

  // Initialize from localStorage, default to true (open)
  const [showPublications, setShowPublications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resume-showPublications')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const [showLanguages, setShowLanguages] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resume-showLanguages')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const [showCertifications, setShowCertifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resume-showCertifications')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const [resumeData, setResumeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Animation refs
  const [educationRef, educationInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [experienceRef, experienceInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialMount) {
      localStorage.setItem('resume-showPublications', JSON.stringify(showPublications))
    }
  }, [showPublications, isInitialMount])

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialMount) {
      localStorage.setItem('resume-showLanguages', JSON.stringify(showLanguages))
    }
  }, [showLanguages, isInitialMount])

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialMount) {
      localStorage.setItem('resume-showCertifications', JSON.stringify(showCertifications))
    }
  }, [showCertifications, isInitialMount])

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch('/api/resume')
        const data = await response.json()
        setResumeData(data)
        setLoading(false)
        // Mark initial mount complete after data loads
        setTimeout(() => setIsInitialMount(false), 500)
      } catch (error) {
        console.error('Error loading resume:', error)
        setLoading(false)
        setTimeout(() => setIsInitialMount(false), 500)
      }
    }

    fetchResumeData()
  }, [])

  // Generate JSON-LD structured data for SEO
  const generatePersonSchema = () => {
    if (!resumeData) return null
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: resumeData.name,
      jobTitle: resumeData.title,
      description: resumeData.bio,
      email: `mailto:${resumeData.email}`,
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      sameAs: [
        resumeData.linkedinPersonal,
        resumeData.linkedinBusiness,
      ].filter(Boolean),
      alumniOf: resumeData.education?.map((edu: Education) => ({
        "@type": "EducationalOrganization",
        name: edu.schoolName,
      })),
      worksFor: resumeData.experiences?.[0] ? {
        "@type": "Organization",
        name: resumeData.experiences[0].company,
      } : undefined,
      knowsAbout: resumeData.skills?.map((skill: Skill) => skill.name),
    }
    
    return JSON.stringify(schema)
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="animate-pulse text-2xl text-white">Loading...</div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-2xl text-white">No resume data available</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generatePersonSchema() || '' }}
      />
      {/* Navigation Header */}
      <Navigation showBackButton />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.heroGradient} rounded-2xl shadow-xl p-8 mb-8`}
        >
          <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:text-left gap-6">
            {/* Photo + Name/Title on Mobile, Side-by-side on Desktop */}
            <div className="flex flex-col items-center md:flex-row md:items-center gap-6 w-full md:w-auto">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                <img
                  src="/uploads/profile.png"
                  alt={resumeData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient if image not found
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      const fallback = document.createElement('div')
                      fallback.className = 'w-full h-full bg-gradient-to-br from-purple-400 to-blue-400'
                      parent.appendChild(fallback)
                    }
                  }}
                />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <motion.h1
                  className={`text-3xl md:text-4xl font-bold ${theme.headerText}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {resumeData.name}
                </motion.h1>
                <p className={`${theme.headerText} opacity-90 mt-1`}>{resumeData.title}</p>
                <p className={`${theme.headerText} opacity-80 mt-2 max-w-lg`}>{resumeData.bio}</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col gap-3 w-full md:w-auto items-center md:items-start">
              <a href={`mailto:${resumeData.email}`} className={`flex items-center justify-center gap-2 ${theme.headerText} opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300`}>
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </a>
              <a href={resumeData.signalUrl} target="_blank" className={`flex items-center justify-center gap-2 ${theme.headerText} opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300`}>
                <MessageCircle size={18} />
                <span className="text-sm">Signal</span>
              </a>
              <a href={resumeData.linkedinPersonal} target="_blank" className={`flex items-center justify-center gap-2 ${theme.headerText} opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300`}>
                <Linkedin size={18} />
                <span className="text-sm">Personal</span>
              </a>
              <a href={resumeData.linkedinBusiness} target="_blank" className={`flex items-center justify-center gap-2 ${theme.headerText} opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300`}>
                <Building size={18} />
                <span className="text-sm">Business</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Mission Section - Only show if enabled */}
        {resumeData.showMission && resumeData.missionText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${theme.card} ${theme.cardBorder} ${theme.cardShadow} rounded-2xl p-8 mb-8`}
          >
            <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
              {resumeData.missionTitle || 'Mission'}
            </h2>
            <p className={`${theme.textSecondary} leading-relaxed`}>
              {resumeData.missionText}
            </p>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Education Column */}
          <div ref={educationRef}>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <GraduationCap size={24} />
              Education
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme.timeline}`} />
              
              {resumeData.education?.map((edu: Education, index: number) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={educationInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 pb-8"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-2 w-4 h-4 rounded-full ${theme.dot} border-2 border-white`} />

                  <div className={`${theme.card} ${theme.cardBorder} ${theme.cardShadow} ${theme.cardHover} p-4 rounded-lg`}>
                    <h3 className={`font-bold ${theme.text}`}>{edu.degree}</h3>
                    <p className={`${theme.textSecondary} text-sm`}>{edu.major}</p>
                    <p className={`${theme.textMuted} text-sm`}>{edu.schoolName}</p>
                    <p className={`${theme.textMuted} text-sm`}>{edu.location}</p>
                    <p className={`${theme.textMuted} text-xs mt-1`}>{edu.yearsAttended}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div ref={skillsRef}>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <Code size={24} />
              Skills
            </h2>
            
            {/* Skills bars */}
            {resumeData.skills?.map((skill: Skill, index: number) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="mb-4 group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`${theme.text} text-sm font-medium`}>{skill.name}</span>
                  <span className={`${theme.textMuted} text-xs opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {skill.hoverText}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden border border-gray-200 dark:border-slate-600">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: `${skill.level * 10}%` } : {}}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${theme.accent} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}

            {/* Languages Section - Integrated Card Design */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div className={`mt-8 ${theme.cardBorder} rounded-lg overflow-hidden ${theme.cardShadow} ${theme.cardHover}`}>
                <button
                  onClick={() => setShowLanguages(!showLanguages)}
                  className={`w-full text-left ${theme.collapsibleHeader} p-4 flex justify-between items-center group`}
                >
                  <div className="flex items-center gap-2">
                    <Globe size={20} className={theme.text} />
                    <span className={`font-medium ${theme.text}`}>Languages</span>
                  </div>
                  <ChevronRight className={`transform transition-transform duration-300 ${showLanguages ? 'rotate-90' : ''} text-gray-400`} size={20} />
                </button>

                <AnimatePresence>
                  {showLanguages && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: isInitialMount && showLanguages ? 0 : 0
                      }}
                      className="overflow-hidden"
                    >
                      <div className={`${theme.collapsibleContent} p-4`}>
                        {resumeData.languages.map((lang: Language) => (
                          <div key={lang.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className={theme.text}>{lang.name}</span>
                            <span className={theme.textMuted}>{lang.proficiency}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Certifications Section - Integrated Card Design */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className={`mt-4 ${theme.cardBorder} rounded-lg overflow-hidden ${theme.cardShadow} ${theme.cardHover}`}>
                <button
                  onClick={() => setShowCertifications(!showCertifications)}
                  className={`w-full text-left ${theme.collapsibleHeader} p-4 flex justify-between items-center group`}
                >
                  <div className="flex items-center gap-2">
                    <Award size={20} className={theme.text} />
                    <span className={`font-medium ${theme.text}`}>Certifications ({resumeData.certifications.length})</span>
                  </div>
                  <ChevronRight className={`transform transition-transform duration-300 ${showCertifications ? 'rotate-90' : ''} text-gray-400`} size={20} />
                </button>

                <AnimatePresence>
                  {showCertifications && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: isInitialMount && showCertifications ? 0.06 : 0
                      }}
                      className="overflow-hidden"
                    >
                      <div className={`${theme.collapsibleContent} p-4 space-y-3`}>
                        {resumeData.certifications.map((cert: Certification) => (
                          <a
                            key={cert.id}
                            href={cert.agencyUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer group"
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-8 h-8">
                              {cert.iconUrl ? (
                                <img 
                                  src={cert.iconUrl} 
                                  alt={cert.agency}
                                  className="w-8 h-8 object-contain rounded"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                  <Award size={16} className="text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Certification Details */}
                            <div className="flex-1">
                              <div className={`${theme.text} font-medium group-hover:text-brand-orange transition-colors`}>
                                {cert.name}
                              </div>
                              <div className={`${theme.textSecondary} text-sm`}>
                                {cert.agency}
                              </div>
                              <div className={`${theme.textMuted} text-xs mt-1`}>
                                {cert.certNumber && (
                                  <span>Cert #{cert.certNumber} • </span>
                                )}
                                {cert.certDate && (
                                  <span>{new Date(cert.certDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short' 
                                  })}</span>
                                )}
                              </div>
                            </div>


                            {/* External link indicator */}
                            <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Publications Section - Integrated Card Design */}
            {resumeData.publications && resumeData.publications.length > 0 && (
              <div className={`mt-4 ${theme.cardBorder} rounded-lg overflow-hidden ${theme.cardShadow} ${theme.cardHover}`}>
                <button
                  onClick={() => setShowPublications(!showPublications)}
                  className={`w-full text-left ${theme.collapsibleHeader} p-4 flex justify-between items-center group`}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={20} className={theme.text} />
                    <span className={`font-medium ${theme.text}`}>Publications ({resumeData.publications.length})</span>
                  </div>
                  <ChevronRight className={`transform transition-transform duration-300 ${showPublications ? 'rotate-90' : ''} text-gray-400`} size={20} />
                </button>

                <AnimatePresence>
                  {showPublications && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: isInitialMount && showPublications ? 0.12 : 0
                      }}
                      className="overflow-hidden"
                    >
                      <div className={`${theme.collapsibleContent} p-4`}>
                        {resumeData.publications.map((pub: Publication) => (
                          <div key={pub.id} className="py-2 border-b border-gray-200 last:border-0">
                            <p className={`${theme.text} text-sm`}>{pub.title}</p>
                            <p className={`${theme.textMuted} text-xs`}>{pub.year}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Experience Column */}
          <div ref={experienceRef}>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <Briefcase size={24} />
              Experience
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme.timeline}`} />
              
              {resumeData.experiences?.map((exp: Experience, index: number) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={experienceInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 pb-8"
                >
                  {/* Pulsing timeline dot */}
                  <div className="absolute left-0 w-8 h-8 flex items-center justify-center">
                    <div className={`absolute inset-0 ${theme.dot} rounded-full animate-pulse opacity-30`} />
                    <button
                      onClick={() => setSelectedExperience(exp.id)}
                      className={`relative w-4 h-4 rounded-full ${theme.dot} border-2 border-white hover:scale-150 transition-transform cursor-pointer`}
                    />
                  </div>


                  <div className={`${theme.card} ${theme.cardBorder} ${theme.cardShadow} ${theme.cardHover} p-4 rounded-lg cursor-pointer`}
                       onClick={() => setSelectedExperience(exp.id)}>
                    <p className={`${theme.textMuted} text-xs mb-1`}>{formatDateRange(exp)}</p>
                    <h3 className={`font-bold ${theme.text}`}>{exp.jobTitle}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`${theme.textSecondary} text-sm`}>{exp.company}</p>
                      {exp.workLocation && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-300 text-gray-700">
                          {exp.workLocation}
                        </span>
                      )}
                    </div>

                    <ul className={`${theme.textSecondary} text-xs space-y-1`}>
                      {exp.duties?.map((duty, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Modal */}
        <AnimatePresence>
          {selectedExperience && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 ${theme.modalOverlay} backdrop-blur-sm z-50 flex items-center justify-center p-4`}
              onClick={() => setSelectedExperience(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${theme.card} ${theme.cardBorder} rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedExperience(null)}
                  className={`float-right ${theme.text} hover:scale-110 transition-transform`}
                >
                  <X size={24} />
                </button>
                
                {(() => {
                  const exp = resumeData.experiences.find((e: Experience) => e.id === selectedExperience)
                  if (!exp) return null
                  
                  return (
                    <>
                      <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>{exp.jobTitle}</h2>
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`${theme.textSecondary}`}>{exp.company}</p>
                        {exp.workLocation && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-300 text-gray-700">
                            {exp.workLocation}
                          </span>
                        )}
                      </div>
                      <p className={`${theme.textMuted} text-sm mb-6`}>{formatDateRange(exp)}</p>

                      <ul className={`${theme.text} space-y-3`}>
                        {exp.fullBullets?.map((bullet: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className={`mr-2 ${theme.textMuted}`}>•</span>
                            <span className="text-sm leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`text-center mt-16 ${theme.textMuted}`}
        >
          <p className="text-lg font-medium">Thanks for looking!</p>
        </motion.div>
      </div>
    </div>
  )
}