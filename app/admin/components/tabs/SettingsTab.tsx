export function SettingsTab() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Data Management</h3>
          <p className="text-gray-600 mb-4">
            All data is automatically saved when you click the "Save All Changes" button in the header.
          </p>
          
          <div className="space-y-2">
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to export all data? This will download a JSON file.')) {
                  // Export functionality would go here
                  alert('Export functionality to be implemented')
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export All Data
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Cache Management</h3>
          <p className="text-gray-600 mb-4">
            Clear browser cache if you're experiencing issues with data not updating.
          </p>
          
          <button 
            onClick={() => {
              if (confirm('Clear cache and reload? Any unsaved changes will be lost.')) {
                sessionStorage.clear()
                localStorage.clear()
                window.location.reload()
              }
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Clear Cache
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Always save your changes before logging out</li>
            <li>Large images may slow down loading times</li>
            <li>For best results, use images under 500KB</li>
            <li>Changes are visible immediately after saving</li>
          </ul>
        </div>
      </div>
    )
  }