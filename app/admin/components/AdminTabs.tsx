'use client'
// components/admin/AdminTabs.tsx



import React from 'react'
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Upload,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  Save  // Added missing Save icon
} from 'lucide-react'
import { 
  Button, 
  Card, 
  Input, 
  Textarea,
  Badge,
  Alert
} from '@/components/ui'
import { cn } from '@/lib/design-system'

// ============================================
// PROPS INTERFACE
// ============================================
interface AdminTabsProps {
  activeTab: string
  resumeData: any
  setResumeData: (data: any) => void
  showcaseItems: any[]
  setShowcaseItems: (items: any[]) => void
  photoPreview: string | null
  setPhotoPreview: (url: string | null) => void
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleShowcaseImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  saveResumeData: () => void
  saveShowcaseItems: () => void
  saving: boolean
  addItem: (field: string, item: any) => void
  removeItem: (field: string, index: number) => void
  updateItem: (field: string, index: number, key: string, value: any) => void
  moveItem: (field: string, index: number, direction: 'up' | 'down') => void
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminTabs({
  activeTab,
  resumeData,
  setResumeData,
  showcaseItems,
  setShowcaseItems,
  photoPreview,
  setPhotoPreview,
  handlePhotoUpload,
  handleShowcaseImageUpload,
  saveResumeData,
  saveShowcaseItems,
  saving,
  addItem,
  removeItem,
  updateItem,
  moveItem
}: AdminTabsProps) {

  // ============================================
  // RENDER CONTENT BASED ON ACTIVE TAB
  // ============================================
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">General Information</h2>
            
            {/* Profile Photo */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Photo</h3>
              <div className="flex items-center gap-6">
                {photoPreview && (
                  <img 
                    src={photoPreview} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="secondary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </label>
                  {photoPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPhotoPreview(null)
                        setResumeData({ ...resumeData, photoUrl: null })
                      }}
                      className="ml-2"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Basic Info */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="grid gap-4">
                <Input
                  label="Full Name"
                  value={resumeData.name}
                  onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                />
                <Input
                  label="Professional Title"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                />
                <Textarea
                  label="Bio"
                  value={resumeData.bio}
                  onChange={(e) => setResumeData({ ...resumeData, bio: e.target.value })}
                  rows={4}
                />
                <Input
                  label="Email"
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                />
              </div>
            </Card>

            {/* Social Links */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
              <div className="grid gap-4">
                <Input
                  label="Signal URL"
                  value={resumeData.signalUrl}
                  onChange={(e) => setResumeData({ ...resumeData, signalUrl: e.target.value })}
                  placeholder="https://signal.me/..."
                />
                <Input
                  label="LinkedIn Personal"
                  value={resumeData.linkedinPersonal}
                  onChange={(e) => setResumeData({ ...resumeData, linkedinPersonal: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  label="LinkedIn Business"
                  value={resumeData.linkedinBusiness}
                  onChange={(e) => setResumeData({ ...resumeData, linkedinBusiness: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </Card>

            {/* Mission Statement */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Mission Statement</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={resumeData.showMission}
                    onChange={(e) => setResumeData({ ...resumeData, showMission: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Show mission statement on resume</span>
                </label>
                
                {resumeData.showMission && (
                  <>
                    <Input
                      label="Mission Title"
                      value={resumeData.missionTitle}
                      onChange={(e) => setResumeData({ ...resumeData, missionTitle: e.target.value })}
                      placeholder="Mission Statement"
                    />
                    <Textarea
                      label="Mission Text"
                      value={resumeData.missionText}
                      onChange={(e) => setResumeData({ ...resumeData, missionText: e.target.value })}
                      rows={4}
                    />
                  </>
                )}
              </div>
            </Card>

            <Button onClick={saveResumeData} variant="primary" loading={saving} fullWidth>
              Save General Information
            </Button>
          </div>
        )

      case 'experiences':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Professional Experience</h2>
              <Button
                onClick={() => addItem('experiences', {
                  id: `exp_${Date.now()}`,
                  jobTitle: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  isCurrent: false,
                  workLocation: null,
                  duties: ['', '', ''],
                  fullBullets: []
                })}
                variant="primary"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-4">
              {resumeData.experiences?.map((exp: any, index: number) => (
                <Card key={exp.id}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {exp.jobTitle || 'New Experience'}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => moveItem('experiences', index, 'up')}
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => moveItem('experiences', index, 'down')}
                        variant="ghost"
                        size="sm"
                        disabled={index === resumeData.experiences.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => removeItem('experiences', index)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) => updateItem('experiences', index, 'jobTitle', e.target.value)}
                      />
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => updateItem('experiences', index, 'company', e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateItem('experiences', index, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => updateItem('experiences', index, 'endDate', e.target.value)}
                        disabled={exp.isCurrent}
                      />
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 pb-2">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={(e) => updateItem('experiences', index, 'isCurrent', e.target.checked)}
                            className="w-5 h-5 rounded"
                          />
                          <span className="text-gray-300">Current Position</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Work Location
                      </label>
                      <div className="flex gap-2">
                        {['In-Person', 'Remote', 'Hybrid'].map((location) => (
                          <Button
                            key={location}
                            variant={exp.workLocation === location.toLowerCase() || (location === 'In-Person' && !exp.workLocation) ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => updateItem('experiences', index, 'workLocation', location === 'In-Person' ? null : location.toLowerCase())}
                          >
                            {location}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Responsibilities (3 shown on resume)
                      </label>
                      {[0, 1, 2].map((i) => (
                        <Input
                          key={i}
                          value={exp.duties?.[i] || ''}
                          onChange={(e) => {
                            const newDuties = [...(exp.duties || ['', '', ''])]
                            newDuties[i] = e.target.value
                            updateItem('experiences', index, 'duties', newDuties)
                          }}
                          placeholder={`Responsibility ${i + 1}`}
                          className="mb-2"
                        />
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Bullets (shown on expansion)
                      </label>
                      <Textarea
                        value={exp.fullBullets?.slice(3).join('\n') || ''}
                        onChange={(e) => {
                          const additionalBullets = e.target.value.split('\n').filter(b => b.trim())
                          const fullBullets = [...(exp.duties || []), ...additionalBullets]
                          updateItem('experiences', index, 'fullBullets', fullBullets)
                        }}
                        rows={4}
                        placeholder="Enter each bullet point on a new line"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button onClick={saveResumeData} variant="primary" loading={saving} fullWidth>
              Save Experience
            </Button>
          </div>
        )

      case 'showcase':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Showcase Items</h2>
              <div className="flex gap-2">
                <Button
                  onClick={saveShowcaseItems}
                  variant="primary"  // Changed from "success" to "primary"
                  size="sm"
                  loading={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Showcase
                </Button>
                <Button
                  onClick={() => {
                    if (showcaseItems.length >= 6) {
                      alert('Maximum 6 showcase items allowed')
                      return
                    }
                    const newItem = {
                      id: `showcase_${Date.now()}`,
                      title: '',
                      description: '',
                      imageUrl: null,
                      linkUrl: '',
                      linkType: 'internal',
                      order: showcaseItems.length,
                      isActive: true
                    }
                    setShowcaseItems([...showcaseItems, newItem])
                  }}
                  disabled={showcaseItems.length >= 6}
                  variant="primary"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            <Alert variant="info" title="Showcase Info">
              Showcase items appear on the landing page. Upload 1200x630 images for best results. Maximum 6 items.
            </Alert>

            <div className="grid gap-4">
              {showcaseItems.map((item, index) => (
                <Card key={item.id}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {item.title || 'New Showcase Item'}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const updated = [...showcaseItems]
                          updated[index].isActive = !updated[index].isActive
                          setShowcaseItems(updated)
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => setShowcaseItems(showcaseItems.filter((_, i) => i !== index))}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Input
                      label="Title"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...showcaseItems]
                        updated[index].title = e.target.value
                        setShowcaseItems(updated)
                      }}
                    />

                    <Textarea
                      label="Description"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...showcaseItems]
                        updated[index].description = e.target.value
                        setShowcaseItems(updated)
                      }}
                      rows={3}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Link URL"
                        value={item.linkUrl}
                        onChange={(e) => {
                          const updated = [...showcaseItems]
                          updated[index].linkUrl = e.target.value
                          setShowcaseItems(updated)
                        }}
                        placeholder="/resume or https://..."
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Link Type
                        </label>
                        <select
                          value={item.linkType}
                          onChange={(e) => {
                            const updated = [...showcaseItems]
                            updated[index].linkType = e.target.value
                            setShowcaseItems(updated)
                          }}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        >
                          <option value="internal">Internal</option>
                          <option value="external">External</option>
                          <option value="mailto">Email</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Preview Image (1200x630 recommended)
                      </label>
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleShowcaseImageUpload(index, e)}
                        className="hidden"
                        id={`showcase-upload-${index}`}
                      />
                      <label htmlFor={`showcase-upload-${index}`}>
                        <Button variant="secondary" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </label>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      // Add other tab cases here (education, skills, etc.)
      // Following the same pattern with the new design system components

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Content for {activeTab} coming soon...</p>
          </div>
        )
    }
  }

  return <>{renderTabContent()}</>
}