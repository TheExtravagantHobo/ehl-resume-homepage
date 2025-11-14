import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import type { Experience } from '@/types/resume'

interface ExperienceTabProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
}

export function ExperienceTab({ experiences, onChange }: ExperienceTabProps) {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      duties: [],
      fullBullets: [],
      startDate: '',
      endDate: null,
      isCurrent: false,
      order: experiences.length
    }
    onChange([...experiences, newExp])
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    
    // Update order values when moving items
    if (field === 'order') {
      updated.forEach((exp, i) => {
        exp.order = i
      })
    }
    
    onChange(updated)
  }

  const deleteExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index)
    // Update order values
    updated.forEach((exp, i) => {
      exp.order = i
    })
    onChange(updated)
  }

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newExperiences = [...experiences]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < experiences.length) {
      [newExperiences[index], newExperiences[newIndex]] = [newExperiences[newIndex], newExperiences[index]]
      // Update order values
      newExperiences.forEach((exp, i) => {
        exp.order = i
      })
      onChange(newExperiences)
    }
  }

  return (
    <ListManager
      title="Experience"
      items={experiences}
      onAdd={addExperience}
      onUpdate={updateExperience}
      onDelete={deleteExperience}
      onMove={moveExperience}
      renderItem={(exp, index) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Job Title"
              value={exp.jobTitle}
              onChange={(value) => updateExperience(index, 'jobTitle', value)}
              placeholder="e.g., Senior Developer"
            />
            <FormField
              label="Company"
              value={exp.company}
              onChange={(value) => updateExperience(index, 'company', value)}
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              type="date"
              value={exp.startDate}
              onChange={(value) => updateExperience(index, 'startDate', value)}
            />
            <div>
              <FormField
                label="End Date"
                type="date"
                value={exp.endDate || ''}
                onChange={(value) => updateExperience(index, 'endDate', value)}
                disabled={exp.isCurrent}
              />
              <FormField
                label="Current Position"
                type="checkbox"
                value={exp.isCurrent || false}
                onChange={(value) => {
                  updateExperience(index, 'isCurrent', value)
                  if (value) {
                    updateExperience(index, 'endDate', null)
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Work Location"
              type="select"
              value={exp.workLocation || ''}
              onChange={(value) => updateExperience(index, 'workLocation', value || null)}
              placeholder="On-site"
              options={[
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' }
              ]}
            />
          </div>

          <FormField
            label="Short Duties (comma-separated)"
            type="textarea"
            value={exp.duties?.join(', ') || ''}
            onChange={(value) => {
              const duties = value.split(',').map((s: string) => s.trim()).filter(Boolean)
              updateExperience(index, 'duties', duties)
            }}
            placeholder="Brief summary points, separated by commas"
            rows={2}
          />

          <FormField
            label="Full Bullets (one per line)"
            type="textarea"
            value={exp.fullBullets?.join('\n') || ''}
            onChange={(value) => {
              const bullets = value.split('\n').filter(Boolean)
              updateExperience(index, 'fullBullets', bullets)
            }}
            placeholder="Detailed achievements and responsibilities, one per line"
            rows={5}
          />

          <div className="grid grid-cols-4 gap-4">
            <FormField
              label="Street"
              value={exp.street || ''}
              onChange={(value) => updateExperience(index, 'street', value)}
              placeholder="Street address"
            />
            <FormField
              label="City"
              value={exp.city || ''}
              onChange={(value) => updateExperience(index, 'city', value)}
              placeholder="City"
            />
            <FormField
              label="State"
              value={exp.state || ''}
              onChange={(value) => updateExperience(index, 'state', value)}
              placeholder="State"
            />
            <FormField
              label="ZIP Code"
              value={exp.zipCode || ''}
              onChange={(value) => updateExperience(index, 'zipCode', value)}
              placeholder="ZIP"
            />
          </div>
        </div>
      )}
    />
  )
}