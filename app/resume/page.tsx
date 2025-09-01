// app/resume/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
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
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

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

// Only dark-modern theme
const theme = {
  bg: 'bg-gradient-to-br from-slate-900 to-slate-800',
  card: 'bg-slate-800',
  text: 'text-white',
  subtext: 'text-gray-400',
  accent: 'from-purple-500 to-blue-500',
  border: 'border-slate-700',
  timeline: 'bg-slate-600',
  dot: 'bg-purple-500',
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
  const [showPublications, setShowPublications] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Animation refs
  const [educationRef, educationInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [experienceRef, experienceInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch('/api/resume')
        const data = await response.json()
        setResumeData(data)
        setLoading(false)
      } catch (error) {
        console.error('Error loading resume:', error)
        setLoading(false)
      }
    }
    
    fetchResumeData()
  }, [])

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
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.card} rounded-2xl shadow-xl p-8 mb-8`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left side - Photo */}
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
                {resumeData.photoUrl ? (
                  <img 
                    src={resumeData.photoUrl} 
                    alt={resumeData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
                )}
              </div>
              <div>
                <motion.h1 
                  className={`text-4xl font-bold ${theme.text}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {resumeData.name}
                </motion.h1>
                <p className={`${theme.subtext} mt-1`}>{resumeData.title}</p>
                <p className={`${theme.subtext} mt-2 max-w-lg`}>{resumeData.bio}</p>
              </div>
            </div>

            {/* Right side - Contact */}
            <div className="flex flex-col gap-3">
              <a href={`mailto:${resumeData.email}`} className={`flex items-center gap-2 ${theme.subtext} hover:scale-105 transition-transform`}>
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </a>
              <a href={resumeData.signalUrl} target="_blank" className={`flex items-center gap-2 ${theme.subtext} hover:scale-105 transition-transform`}>
                <MessageCircle size={18} />
                <span className="text-sm">Signal</span>
              </a>
              <a href={resumeData.linkedinPersonal} target="_blank" className={`flex items-center gap-2 ${theme.subtext} hover:scale-105 transition-transform`}>
                <Linkedin size={18} />
                <span className="text-sm">Personal</span>
              </a>
              <a href={resumeData.linkedinBusiness} target="_blank" className={`flex items-center gap-2 ${theme.subtext} hover:scale-105 transition-transform`}>
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
            className={`${theme.card} rounded-2xl shadow-xl p-8 mb-8`}
          >
            <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
              {resumeData.missionTitle || 'Mission'}
            </h2>
            <p className={`${theme.subtext} leading-relaxed`}>
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
                  
                  <div className={`${theme.card} p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105`}>
                    <h3 className={`font-bold ${theme.text}`}>{edu.degree}</h3>
                    <p className={`${theme.subtext} text-sm`}>{edu.major}</p>
                    <p className={`${theme.subtext} text-sm`}>{edu.schoolName}</p>
                    <p className={`${theme.subtext} text-sm`}>{edu.location}</p>
                    <p className={`${theme.subtext} text-xs mt-1`}>{edu.yearsAttended}</p>
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
                  <span className={`${theme.subtext} text-xs opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {skill.hoverText}
                  </span>
                </div>
                <div className={`w-full h-3 ${theme.card} rounded-full overflow-hidden`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: `${skill.level * 10}%` } : {}}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${theme.accent} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}

            {/* Languages Section */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => setShowLanguages(!showLanguages)}
                  className={`w-full text-left ${theme.card} p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-between items-center group`}
                >
                  <div className="flex items-center gap-2">
                    <Globe size={20} />
                    <span className={`font-medium ${theme.text}`}>Languages</span>
                  </div>
                  <ChevronRight className={`transform transition-transform ${showLanguages ? 'rotate-90' : ''} text-gray-400`} size={20} />
                </button>
                
                <AnimatePresence>
                  {showLanguages && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-2 ${theme.card} p-4 rounded-lg`}>
                        {resumeData.languages.map((lang: Language) => (
                          <div key={lang.id} className="flex justify-between py-1">
                            <span className={theme.text}>{lang.name}</span>
                            <span className={theme.subtext}>{lang.proficiency}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Publications Section */}
            {resumeData.publications && resumeData.publications.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowPublications(!showPublications)}
                  className={`w-full text-left ${theme.card} p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-between items-center group`}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={20} />
                    <span className={`font-medium ${theme.text}`}>Publications ({resumeData.publications.length})</span>
                  </div>
                  <ChevronRight className={`transform transition-transform ${showPublications ? 'rotate-90' : ''} text-gray-400`} size={20} />
                </button>
                
                <AnimatePresence>
                  {showPublications && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-2 ${theme.card} p-4 rounded-lg`}>
                        {resumeData.publications.map((pub: Publication) => (
                          <div key={pub.id} className="py-2 border-b border-slate-700 last:border-0">
                            <p className={`${theme.text} text-sm`}>{pub.title}</p>
                            <p className={`${theme.subtext} text-xs`}>{pub.year}</p>
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
                  
                  <div className={`${theme.card} p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer`}
                       onClick={() => setSelectedExperience(exp.id)}>
                    <p className={`${theme.subtext} text-xs mb-1`}>{formatDateRange(exp)}</p>
                    <h3 className={`font-bold ${theme.text}`}>{exp.jobTitle}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`${theme.subtext} text-sm`}>{exp.company}</p>
                      {exp.workLocation && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400">
                          {exp.workLocation}
                        </span>
                      )}
                    </div>
                    
                    <ul className={`${theme.subtext} text-xs space-y-1`}>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedExperience(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${theme.card} rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto`}
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
                        <p className={`${theme.subtext}`}>{exp.company}</p>
                        {exp.workLocation && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400">
                            {exp.workLocation}
                          </span>
                        )}
                      </div>
                      <p className={`${theme.subtext} text-sm mb-6`}>{formatDateRange(exp)}</p>
                      
                      <ul className={`${theme.text} space-y-3`}>
                        {exp.fullBullets?.map((bullet: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className={`mr-2 ${theme.subtext}`}>•</span>
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
          className={`text-center mt-16 ${theme.subtext}`}
        >
          <p className="text-lg font-medium">Thanks for looking!</p>
        </motion.div>
      </div>
    </div>
  )
}