// app/admin/components/tabs/SkillsTab.tsx

import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import type { Skill } from '@/types/resume'

interface SkillsTabProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

export function SkillsTab({ skills, onChange }: SkillsTabProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 5,
      hoverText: '',
      order: skills.length
    }
    onChange([...skills, newSkill])
  }

  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((skill, i) => { skill.order = i })
    onChange(updated)
  }

  const deleteSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index)
    updated.forEach((skill, i) => { skill.order = i })
    onChange(updated)
  }

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const newSkills = [...skills]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < skills.length) {
      [newSkills[index], newSkills[newIndex]] = [newSkills[newIndex], newSkills[index]]
      newSkills.forEach((skill, i) => { skill.order = i })
      onChange(newSkills)
    }
  }

  return (
    <ListManager
      title="Skills"
      items={skills}
      onAdd={addSkill}
      onUpdate={updateSkill}
      onDelete={deleteSkill}
      onMove={moveSkill}
      renderItem={(skill, index) => (
        <div className="space-y-4">
          <FormField
            label="Skill Name"
            value={skill.name}
            onChange={(value) => updateSkill(index, 'name', value)}
            placeholder="e.g., Project Management"
          />
          
          <FormField
            label={`Proficiency Level: ${skill.level}/10`}
            type="range"
            min={1}
            max={10}
            value={skill.level}
            onChange={(value) => updateSkill(index, 'level', value)}
          />
          
          <FormField
            label="Hover Text (appears on mouseover)"
            value={skill.hoverText}
            onChange={(value) => updateSkill(index, 'hoverText', value)}
            placeholder="e.g., 10+ Years Experience"
          />
        </div>
      )}
    />
  )
}
