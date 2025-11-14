// app/admin/components/tabs/LanguagesTab.tsx
import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import type { Language } from '@/types/resume'

interface LanguagesTabProps {
  languages: Language[]
  onChange: (languages: Language[]) => void
}

export function LanguagesTab({ languages, onChange }: LanguagesTabProps) {
  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: '',
      order: languages.length
    }
    onChange([...languages, newLang])
  }

  const updateLanguage = (index: number, field: string, value: any) => {
    const updated = [...languages]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((lang, i) => { lang.order = i })
    onChange(updated)
  }

  const deleteLanguage = (index: number) => {
    const updated = languages.filter((_, i) => i !== index)
    updated.forEach((lang, i) => { lang.order = i })
    onChange(updated)
  }

  const moveLanguage = (index: number, direction: 'up' | 'down') => {
    const newLanguages = [...languages]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < languages.length) {
      [newLanguages[index], newLanguages[newIndex]] = [newLanguages[newIndex], newLanguages[index]]
      newLanguages.forEach((lang, i) => { lang.order = i })
      onChange(newLanguages)
    }
  }

  const proficiencyOptions = [
    { value: 'Native', label: 'Native' },
    { value: 'Fluent', label: 'Fluent' },
    { value: 'Professional Working', label: 'Professional Working' },
    { value: 'Limited Working', label: 'Limited Working' },
    { value: 'Elementary', label: 'Elementary' },
    { value: 'Basic', label: 'Basic' }
  ]

  return (
    <ListManager
      title="Languages"
      items={languages}
      onAdd={addLanguage}
      onUpdate={updateLanguage}
      onDelete={deleteLanguage}
      onMove={moveLanguage}
      renderItem={(lang, index) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Language"
              value={lang.name}
              onChange={(value) => updateLanguage(index, 'name', value)}
              placeholder="e.g., Spanish, Mandarin"
            />
            
            <FormField
              label="Proficiency"
              type="select"
              value={lang.proficiency}
              onChange={(value) => updateLanguage(index, 'proficiency', value)}
              options={proficiencyOptions}
              placeholder="Select proficiency level"
            />
          </div>
        </div>
      )}
    />
  )
}