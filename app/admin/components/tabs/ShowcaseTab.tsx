// app/admin/components/tabs/ShowcaseTab.tsx
import { useState } from 'react'
import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import { Upload } from 'lucide-react'
import type { ShowcaseItem } from '@/types/resume'

interface ShowcaseTabProps {
  showcaseItems: ShowcaseItem[]
  onChange: (items: ShowcaseItem[]) => void
}

export function ShowcaseTab({ showcaseItems, onChange }: ShowcaseTabProps) {
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)
  const addShowcaseItem = () => {
    const newItem: ShowcaseItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      imageUrl: null,
      linkUrl: '',
      linkType: 'internal',
      order: showcaseItems.length,
      isActive: true
    }
    onChange([...showcaseItems, newItem])
  }

  const updateShowcaseItem = (index: number, field: string, value: any) => {
    const updated = [...showcaseItems]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((item, i) => { item.order = i })
    console.log('[ShowcaseTab] updateShowcaseItem:', field, '=', value)
    console.log('[ShowcaseTab] Updated item:', updated[index])
    onChange(updated)
  }

  const deleteShowcaseItem = (index: number) => {
    const updated = showcaseItems.filter((_, i) => i !== index)
    updated.forEach((item, i) => { item.order = i })
    onChange(updated)
  }

  const moveShowcaseItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...showcaseItems]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < showcaseItems.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
      newItems.forEach((item, i) => { item.order = i })
      onChange(newItems)
    }
  }

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const item = showcaseItems[index]
    const oldBlobUrl = item.imageUrl?.includes('blob.vercel-storage.com') ? item.imageUrl : null

    setUploadingImage(index)

    try {
      // Create FormData and append file
      const formData = new FormData()
      formData.append('file', file)
      if (oldBlobUrl) {
        formData.append('oldBlobUrl', oldBlobUrl)
      }

      // Upload to Vercel Blob
      const response = await fetch('/api/showcase/upload-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update the showcase item with the Vercel Blob URL
      updateShowcaseItem(index, 'imageUrl', data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploadingImage(null)
    }
  }

  const linkTypeOptions = [
    { value: 'internal', label: 'Internal Link' },
    { value: 'external', label: 'External Link' },
    { value: 'mailto', label: 'Email Link' }
  ]

  return (
    <ListManager
      title="Showcase Items"
      items={showcaseItems}
      onAdd={addShowcaseItem}
      onUpdate={updateShowcaseItem}
      onDelete={deleteShowcaseItem}
      onMove={moveShowcaseItem}
      renderItem={(item, index) => (
        <div className="space-y-4">
          <FormField
            label="Title"
            value={item.title}
            onChange={(value) => updateShowcaseItem(index, 'title', value)}
            placeholder="e.g., Interactive Resume"
          />
          
          <FormField
            label="Description"
            type="textarea"
            value={item.description}
            onChange={(value) => updateShowcaseItem(index, 'description', value)}
            placeholder="Brief description of the showcase item"
            rows={2}
          />
          
          <div>
            <label className="block text-sm font-medium mb-2">Image (optional)</label>
            <div className="flex items-center gap-4">
              {item.imageUrl && (
                <div className="w-32 h-20 rounded overflow-hidden bg-gray-200">
                  <img src={item.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className={`cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 ${uploadingImage === index ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload size={18} />
                {uploadingImage === index ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  disabled={uploadingImage === index}
                  className="hidden"
                />
              </label>
              {item.imageUrl && (
                <button
                  onClick={() => updateShowcaseItem(index, 'imageUrl', null)}
                  disabled={uploadingImage === index}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Link URL"
              value={item.linkUrl}
              onChange={(value) => updateShowcaseItem(index, 'linkUrl', value)}
              placeholder="e.g., /resume or https://..."
            />
            <FormField
              label="Link Type"
              type="select"
              value={item.linkType}
              onChange={(value) => updateShowcaseItem(index, 'linkType', value)}
              options={linkTypeOptions}
            />
          </div>
          
          <FormField
            label="Active"
            type="checkbox"
            value={item.isActive}
            onChange={(value) => updateShowcaseItem(index, 'isActive', value)}
          />
        </div>
      )}
    />
  )
}