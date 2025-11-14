import { FormField } from '../shared/FormField'

interface PersonalInfoTabProps {
  data: {
    name: string
    title: string
    bio: string
    email: string
    signalUrl: string
    linkedinPersonal: string
    linkedinBusiness: string
    showMission: boolean
    missionTitle: string
    missionText: string
  }
  onChange: (updates: any) => void
}

export function PersonalInfoTab({ data, onChange }: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>

      {/* Profile Photo Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Profile Photo:</strong> Place your profile photo at{' '}
          <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">/public/uploads/profile.png</code>
          {' '}to display it on your resume.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Name"
          value={data.name}
          onChange={(value) => onChange({ name: value })}
          placeholder="Your name"
        />
        <FormField
          label="Title"
          value={data.title}
          onChange={(value) => onChange({ title: value })}
          placeholder="Your professional title"
        />
      </div>

      <FormField
        label="Bio"
        type="textarea"
        value={data.bio}
        onChange={(value) => onChange({ bio: value })}
        placeholder="Brief biography"
        rows={3}
      />

      <FormField
        label="Email"
        type="email"
        value={data.email}
        onChange={(value) => onChange({ email: value })}
        placeholder="your@email.com"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Signal URL"
          type="url"
          value={data.signalUrl}
          onChange={(value) => onChange({ signalUrl: value })}
          placeholder="https://signal.me/..."
        />
        <FormField
          label="LinkedIn Personal"
          type="url"
          value={data.linkedinPersonal}
          onChange={(value) => onChange({ linkedinPersonal: value })}
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <FormField
        label="LinkedIn Business"
        type="url"
        value={data.linkedinBusiness}
        onChange={(value) => onChange({ linkedinBusiness: value })}
        placeholder="https://linkedin.com/company/..."
      />

      <div className="border-t pt-4">
        <FormField
          label="Show Mission Statement"
          type="checkbox"
          value={data.showMission}
          onChange={(value) => onChange({ showMission: value })}
        />

        {data.showMission && (
          <div className="mt-4 space-y-4">
            <FormField
              label="Mission Title"
              value={data.missionTitle}
              onChange={(value) => onChange({ missionTitle: value })}
              placeholder="Mission"
            />
            <FormField
              label="Mission Text"
              type="textarea"
              value={data.missionText}
              onChange={(value) => onChange({ missionText: value })}
              placeholder="Your mission statement..."
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  )
}