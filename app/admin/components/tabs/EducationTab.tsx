// app/admin/components/tabs/EducationTab.tsx

import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import type { Education } from '@/types/resume'

interface EducationTabProps {
  education: Education[]
  onChange: (education: Education[]) => void
}

export function EducationTab({ education, onChange }: EducationTabProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      schoolName: '',
      degree: '',
      major: '',
      location: '',
      yearsAttended: '',
      order: education.length
    }
    onChange([...education, newEdu])
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((edu, i) => { edu.order = i })
    onChange(updated)
  }

  const deleteEducation = (index: number) => {
    const updated = education.filter((_, i) => i !== index)
    updated.forEach((edu, i) => { edu.order = i })
    onChange(updated)
  }

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newEducation = [...education]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < education.length) {
      [newEducation[index], newEducation[newIndex]] = [newEducation[newIndex], newEducation[index]]
      newEducation.forEach((edu, i) => { edu.order = i })
      onChange(newEducation)
    }
  }

  return (
    <ListManager
      title="Education"
      items={education}
      onAdd={addEducation}
      onUpdate={updateEducation}
      onDelete={deleteEducation}
      onMove={moveEducation}
      renderItem={(edu, index) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="School Name"
              value={edu.schoolName}
              onChange={(value) => updateEducation(index, 'schoolName', value)}
              placeholder="e.g., Harvard University"
            />
            <FormField
              label="Degree"
              value={edu.degree}
              onChange={(value) => updateEducation(index, 'degree', value)}
              placeholder="e.g., B.S., M.A., Ph.D."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Major/Field of Study"
              value={edu.major}
              onChange={(value) => updateEducation(index, 'major', value)}
              placeholder="e.g., Computer Science"
            />
            <FormField
              label="Location"
              value={edu.location}
              onChange={(value) => updateEducation(index, 'location', value)}
              placeholder="e.g., Cambridge, MA"
            />
          </div>
          
          <FormField
            label="Years Attended"
            value={edu.yearsAttended}
            onChange={(value) => updateEducation(index, 'yearsAttended', value)}
            placeholder="e.g., 2018-2022"
          />
        </div>
      )}
    />
  )
}
