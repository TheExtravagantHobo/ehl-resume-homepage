// app/admin/components/tabs/PublicationsTab.tsx

import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import type { Publication } from '@/types/resume'

interface PublicationsTabProps {
  publications: Publication[]
  onChange: (publications: Publication[]) => void
}

export function PublicationsTab({ publications, onChange }: PublicationsTabProps) {
  const addPublication = () => {
    const newPub: Publication = {
      id: Date.now().toString(),
      title: '',
      year: new Date().getFullYear().toString(),
      order: publications.length
    }
    onChange([...publications, newPub])
  }

  const updatePublication = (index: number, field: string, value: any) => {
    const updated = [...publications]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((pub, i) => { pub.order = i })
    onChange(updated)
  }

  const deletePublication = (index: number) => {
    const updated = publications.filter((_, i) => i !== index)
    updated.forEach((pub, i) => { pub.order = i })
    onChange(updated)
  }

  const movePublication = (index: number, direction: 'up' | 'down') => {
    const newPublications = [...publications]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < publications.length) {
      [newPublications[index], newPublications[newIndex]] = [newPublications[newIndex], newPublications[index]]
      newPublications.forEach((pub, i) => { pub.order = i })
      onChange(newPublications)
    }
  }

  return (
    <ListManager
      title="Publications"
      items={publications}
      onAdd={addPublication}
      onUpdate={updatePublication}
      onDelete={deletePublication}
      onMove={movePublication}
      renderItem={(pub, index) => (
        <div className="space-y-4">
          <FormField
            label="Publication Title"
            value={pub.title}
            onChange={(value) => updatePublication(index, 'title', value)}
            placeholder="e.g., Research Paper Title or Report Name"
          />
          
          <FormField
            label="Year"
            value={pub.year}
            onChange={(value) => updatePublication(index, 'year', value)}
            placeholder="e.g., 2023"
          />
        </div>
      )}
    />
  )
}