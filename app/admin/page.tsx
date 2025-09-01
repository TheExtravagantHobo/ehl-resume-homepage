// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  LogOut,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Settings,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('general')
  const [resumeData, setResumeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Load data on mount
  useEffect(() => {
    if (session) {
      loadResumeData()
    }
  }, [session])

  const loadResumeData = async () => {
    try {
      const response = await fetch('/api/resume')
      const data = await response.json()
      setResumeData(data)
      setPhotoPreview(data.photoUrl)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to load resume data')
      setLoading(false)
    }
  }

  const saveResumeData = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      })
      if (response.ok) {
        toast.success('Resume updated successfully!')
      } else {
        toast.error('Failed to save changes')
      }
    } catch (error) {
      toast.error('Error saving resume')
    }
    setSaving(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPhotoPreview(base64)
        setResumeData({ ...resumeData, photoUrl: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  // Auth check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <button
            onClick={() => signIn('credentials')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all"
          >
            Sign In with Email
          </button>
        </div>
      </div>
    )
  }

  if (loading || !resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading resume data...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'publications', label: 'Publications', icon: FileText },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Admin Panel</h1>
          <div className="flex gap-4">
            <button
              onClick={saveResumeData}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64">
            <nav className="bg-white rounded-lg shadow-md p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">General Information</h2>
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {photoPreview && (
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Upload size={18} />
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={resumeData.name || ''}
                        onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={resumeData.title || ''}
                        onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={resumeData.bio || ''}
                      onChange={(e) => setResumeData({ ...resumeData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.email || ''}
                        onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Signal URL</label>
                      <input
                        type="text"
                        value={resumeData.signalUrl || ''}
                        onChange={(e) => setResumeData({ ...resumeData, signalUrl: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn Personal</label>
                      <input
                        type="text"
                        value={resumeData.linkedinPersonal || ''}
                        onChange={(e) => setResumeData({ ...resumeData, linkedinPersonal: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn Business</label>
                      <input
                        type="text"
                        value={resumeData.linkedinBusiness || ''}
                        onChange={(e) => setResumeData({ ...resumeData, linkedinBusiness: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Experience</h2>
                    <button
                      onClick={() => {
                        const newExp = {
                          id: Date.now().toString(),
                          dateRange: '',
                          jobTitle: '',
                          company: '',
                          duties: ['', '', ''],
                          fullBullets: [''],
                          workLocation: null,
                          order: resumeData.experiences.length
                        }
                        setResumeData({
                          ...resumeData,
                          experiences: [...resumeData.experiences, newExp]
                        })
                      }}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={18} />
                      Add Experience
                    </button>
                  </div>

                  {resumeData.experiences?.map((exp: any, index: number) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <input
                              type="text"
                              placeholder="Date Range"
                              value={exp.dateRange}
                              onChange={(e) => {
                                const updated = [...resumeData.experiences]
                                updated[index].dateRange = e.target.value
                                setResumeData({ ...resumeData, experiences: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              placeholder="Job Title"
                              value={exp.jobTitle}
                              onChange={(e) => {
                                const updated = [...resumeData.experiences]
                                updated[index].jobTitle = e.target.value
                                setResumeData({ ...resumeData, experiences: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...resumeData.experiences]
                                updated[index].company = e.target.value
                                setResumeData({ ...resumeData, experiences: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Work Location</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`workLocation-${exp.id}`}
                                  value=""
                                  checked={!exp.workLocation}
                                  onChange={() => {
                                    const updated = [...resumeData.experiences]
                                    updated[index].workLocation = null
                                    setResumeData({ ...resumeData, experiences: updated })
                                  }}
                                  className="text-purple-600"
                                />
                                <span className="text-sm">In-Person</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`workLocation-${exp.id}`}
                                  value="remote"
                                  checked={exp.workLocation === 'remote'}
                                  onChange={() => {
                                    const updated = [...resumeData.experiences]
                                    updated[index].workLocation = 'remote'
                                    setResumeData({ ...resumeData, experiences: updated })
                                  }}
                                  className="text-purple-600"
                                />
                                <span className="text-sm">Remote</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`workLocation-${exp.id}`}
                                  value="hybrid"
                                  checked={exp.workLocation === 'hybrid'}
                                  onChange={() => {
                                    const updated = [...resumeData.experiences]
                                    updated[index].workLocation = 'hybrid'
                                    setResumeData({ ...resumeData, experiences: updated })
                                  }}
                                  className="text-purple-600"
                                />
                                <span className="text-sm">Hybrid</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Short Duties (3)</label>
                            {[0, 1, 2].map((i) => (
                              <input
                                key={i}
                                type="text"
                                placeholder={`Duty ${i + 1}`}
                                value={exp.duties[i] || ''}
                                onChange={(e) => {
                                  const updated = [...resumeData.experiences]
                                  if (!updated[index].duties) updated[index].duties = []
                                  updated[index].duties[i] = e.target.value
                                  setResumeData({ ...resumeData, experiences: updated })
                                }}
                                className="w-full px-3 py-2 border rounded-lg mb-2"
                              />
                            ))}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Full Bullets</label>
                            {exp.fullBullets?.map((bullet: string, bulletIndex: number) => (
                              <div key={bulletIndex} className="flex gap-2 mb-2">
                                <textarea
                                  value={bullet}
                                  onChange={(e) => {
                                    const updated = [...resumeData.experiences]
                                    updated[index].fullBullets[bulletIndex] = e.target.value
                                    setResumeData({ ...resumeData, experiences: updated })
                                  }}
                                  rows={2}
                                  className="flex-1 px-3 py-2 border rounded-lg"
                                />
                                <button
                                  onClick={() => {
                                    const updated = [...resumeData.experiences]
                                    updated[index].fullBullets = updated[index].fullBullets.filter((_: any, i: number) => i !== bulletIndex)
                                    setResumeData({ ...resumeData, experiences: updated })
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const updated = [...resumeData.experiences]
                                updated[index].fullBullets = [...(updated[index].fullBullets || []), '']
                                setResumeData({ ...resumeData, experiences: updated })
                              }}
                              className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                              + Add Bullet
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => {
                              const updated = resumeData.experiences.filter((_: any, i: number) => i !== index)
                              setResumeData({ ...resumeData, experiences: updated })
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (index > 0) {
                                const updated = [...resumeData.experiences]
                                const temp = updated[index]
                                updated[index] = updated[index - 1]
                                updated[index - 1] = temp
                                setResumeData({ ...resumeData, experiences: updated })
                              }
                            }}
                            disabled={index === 0}
                            className="text-gray-600 hover:text-gray-700 disabled:opacity-30"
                          >
                            <ArrowUp size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (index < resumeData.experiences.length - 1) {
                                const updated = [...resumeData.experiences]
                                const temp = updated[index]
                                updated[index] = updated[index + 1]
                                updated[index + 1] = temp
                                setResumeData({ ...resumeData, experiences: updated })
                              }
                            }}
                            disabled={index === resumeData.experiences.length - 1}
                            className="text-gray-600 hover:text-gray-700 disabled:opacity-30"
                          >
                            <ArrowDown size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Education</h2>
                    <button
                      onClick={() => {
                        const newEdu = {
                          id: Date.now().toString(),
                          schoolName: '',
                          degree: '',
                          major: '',
                          location: '',
                          yearsAttended: '',
                          order: resumeData.education?.length || 0
                        }
                        setResumeData({
                          ...resumeData,
                          education: [...(resumeData.education || []), newEdu]
                        })
                      }}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={18} />
                      Add Education
                    </button>
                  </div>

                  {resumeData.education?.map((edu: any, index: number) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="School Name"
                            value={edu.schoolName}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].schoolName = e.target.value
                              setResumeData({ ...resumeData, education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].degree = e.target.value
                              setResumeData({ ...resumeData, education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Major"
                            value={edu.major}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].major = e.target.value
                              setResumeData({ ...resumeData, education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].location = e.target.value
                              setResumeData({ ...resumeData, education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Years Attended"
                            value={edu.yearsAttended}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].yearsAttended = e.target.value
                              setResumeData({ ...resumeData, education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg col-span-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = resumeData.education.filter((_: any, i: number) => i !== index)
                            setResumeData({ ...resumeData, education: updated })
                          }}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Skills</h2>
                    <button
                      onClick={() => {
                        const newSkill = {
                          id: Date.now().toString(),
                          name: '',
                          level: 5,
                          hoverText: '',
                          order: resumeData.skills?.length || 0
                        }
                        setResumeData({
                          ...resumeData,
                          skills: [...(resumeData.skills || []), newSkill]
                        })
                      }}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={18} />
                      Add Skill
                    </button>
                  </div>

                  {resumeData.skills?.map((skill: any, index: number) => (
                    <div key={skill.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Skill Name"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...resumeData.skills]
                              updated[index].name = e.target.value
                              setResumeData({ ...resumeData, skills: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Level (1-10)</label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={skill.level}
                              onChange={(e) => {
                                const updated = [...resumeData.skills]
                                updated[index].level = parseInt(e.target.value)
                                setResumeData({ ...resumeData, skills: updated })
                              }}
                              className="w-full"
                            />
                            <span className="text-sm text-gray-600">{skill.level}/10</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Hover Text (e.g., '5 years')"
                            value={skill.hoverText}
                            onChange={(e) => {
                              const updated = [...resumeData.skills]
                              updated[index].hoverText = e.target.value
                              setResumeData({ ...resumeData, skills: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = resumeData.skills.filter((_: any, i: number) => i !== index)
                            setResumeData({ ...resumeData, skills: updated })
                          }}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Publications Tab */}
              {activeTab === 'publications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Publications</h2>
                    <button
                      onClick={() => {
                        const newPub = {
                          id: Date.now().toString(),
                          title: '',
                          year: '',
                          order: resumeData.publications?.length || 0
                        }
                        setResumeData({
                          ...resumeData,
                          publications: [...(resumeData.publications || []), newPub]
                        })
                      }}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={18} />
                      Add Publication
                    </button>
                  </div>

                  {resumeData.publications?.map((pub: any, index: number) => (
                    <div key={pub.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <input
                            type="text"
                            placeholder="Publication Title"
                            value={pub.title}
                            onChange={(e) => {
                              const updated = [...resumeData.publications]
                              updated[index].title = e.target.value
                              setResumeData({ ...resumeData, publications: updated })
                            }}
                            className="px-3 py-2 border rounded-lg col-span-3"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={pub.year}
                            onChange={(e) => {
                              const updated = [...resumeData.publications]
                              updated[index].year = e.target.value
                              setResumeData({ ...resumeData, publications: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = resumeData.publications.filter((_: any, i: number) => i !== index)
                            setResumeData({ ...resumeData, publications: updated })
                          }}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages Tab */}
              {activeTab === 'languages' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Languages</h2>
                    <button
                      onClick={() => {
                        const newLang = {
                          id: Date.now().toString(),
                          name: '',
                          proficiency: '',
                          order: resumeData.languages?.length || 0
                        }
                        setResumeData({
                          ...resumeData,
                          languages: [...(resumeData.languages || []), newLang]
                        })
                      }}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={18} />
                      Add Language
                    </button>
                  </div>

                  {resumeData.languages?.map((lang: any, index: number) => (
                    <div key={lang.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Language"
                            value={lang.name}
                            onChange={(e) => {
                              const updated = [...resumeData.languages]
                              updated[index].name = e.target.value
                              setResumeData({ ...resumeData, languages: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Proficiency Level"
                            value={lang.proficiency}
                            onChange={(e) => {
                              const updated = [...resumeData.languages]
                              updated[index].proficiency = e.target.value
                              setResumeData({ ...resumeData, languages: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = resumeData.languages.filter((_: any, i: number) => i !== index)
                            setResumeData({ ...resumeData, languages: updated })
                          }}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Settings</h2>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Mission Section</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={resumeData.showMission || false}
                              onChange={(e) => setResumeData({ ...resumeData, showMission: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                          <span className="text-sm font-medium">Show Mission Section</span>
                        </div>

                        {resumeData.showMission && (
                          <>
                            <input
                              type="text"
                              placeholder="Mission Title (e.g., 'Mission')"
                              value={resumeData.missionTitle || ''}
                              onChange={(e) => setResumeData({ ...resumeData, missionTitle: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                            <textarea
                              placeholder="Mission Text"
                              value={resumeData.missionText || ''}
                              onChange={(e) => setResumeData({ ...resumeData, missionText: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}