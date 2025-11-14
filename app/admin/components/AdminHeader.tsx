import { Save, LogOut } from 'lucide-react'

interface AdminHeaderProps {
  hasChanges: boolean
  saving: boolean
  onSave: () => void
  onLogout: () => void
}

export function AdminHeader({ hasChanges, saving, onSave, onLogout }: AdminHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <span className="text-sm text-amber-600">You have unsaved changes</span>
            )}
            <button
              onClick={onSave}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}