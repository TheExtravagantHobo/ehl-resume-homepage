import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import type { Certification } from '@/types/resume'

interface CertificationsTabProps {
  certifications: Certification[]
  onChange: (certifications: Certification[]) => void
}

export function CertificationsTab({ certifications, onChange }: CertificationsTabProps) {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      agency: '',
      certNumber: '',
      certDate: '',
      agencyUrl: '',
      iconUrl: null,
      order: certifications.length
    }
    onChange([...certifications, newCert])
  }

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((cert, i) => { cert.order = i })
    onChange(updated)
  }

  const deleteCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index)
    updated.forEach((cert, i) => { cert.order = i })
    onChange(updated)
  }

  const moveCertification = (index: number, direction: 'up' | 'down') => {
    const newCertifications = [...certifications]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < certifications.length) {
      [newCertifications[index], newCertifications[newIndex]] = [newCertifications[newIndex], newCertifications[index]]
      newCertifications.forEach((cert, i) => { cert.order = i })
      onChange(newCertifications)
    }
  }

  return (
    <ListManager
      title="Certifications"
      items={certifications}
      onAdd={addCertification}
      onUpdate={updateCertification}
      onDelete={deleteCertification}
      onMove={moveCertification}
      renderItem={(cert, index) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Certification Name"
              value={cert.name}
              onChange={(value) => updateCertification(index, 'name', value)}
              placeholder="e.g., PMP, AWS Certified"
            />
            <FormField
              label="Issuing Agency"
              value={cert.agency}
              onChange={(value) => updateCertification(index, 'agency', value)}
              placeholder="e.g., PMI, Amazon"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Certificate Number"
              value={cert.certNumber || ''}
              onChange={(value) => updateCertification(index, 'certNumber', value)}
              placeholder="e.g., 123456789"
            />
            <FormField
              label="Date Obtained"
              type="date"
              value={cert.certDate}
              onChange={(value) => updateCertification(index, 'certDate', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Agency Website URL"
              type="url"
              value={cert.agencyUrl || ''}
              onChange={(value) => updateCertification(index, 'agencyUrl', value)}
              placeholder="https://..."
            />
            <FormField
              label="Icon/Logo URL (optional)"
              type="url"
              value={cert.iconUrl || ''}
              onChange={(value) => updateCertification(index, 'iconUrl', value)}
              placeholder="https://..."
            />
          </div>
        </div>
      )}
    />
  )
}