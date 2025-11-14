// app/admin/components/tabs/ArticlesTab.tsx
import { useState } from 'react'
import { ListManager } from '../shared/ListManager'
import { FormField } from '../shared/FormField'
import { Upload } from 'lucide-react'
import type { Article } from '@/types/resume'

interface ArticlesTabProps {
  articles: Article[]
  onChange: (articles: Article[]) => void
}

export function ArticlesTab({ articles, onChange }: ArticlesTabProps) {
  const [fetchingImage, setFetchingImage] = useState<number | null>(null)
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)

  const addArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      excerpt: '',
      url: '',
      ogImageUrl: '',
      publishedDate: '',
      readTime: '',
      tags: [],
      order: articles.length
    }
    onChange([...articles, newArticle])
  }

  const updateArticle = (index: number, field: string, value: any) => {
    const updated = [...articles]
    updated[index] = { ...updated[index], [field]: value }
    updated.forEach((article, i) => { article.order = i })
    onChange(updated)
  }

  const fetchAndStoreImage = async (index: number) => {
    const article = articles[index]
    if (!article.ogImageUrl) {
      alert('Please enter an image URL first')
      return
    }

    // Store the old blob URL for cleanup if it's a Vercel Blob URL
    const oldBlobUrl = article.ogImageUrl.includes('blob.vercel-storage.com')
      ? article.ogImageUrl
      : undefined

    setFetchingImage(index)

    try {
      const response = await fetch('/api/portfolio/fetch-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: article.ogImageUrl,
          oldBlobUrl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch image')
      }

      // Update the article with the new Vercel Blob URL
      updateArticle(index, 'ogImageUrl', data.url)
      alert('Image uploaded to Vercel Blob successfully!')
    } catch (error) {
      console.error('Error fetching image:', error)
      alert(error instanceof Error ? error.message : 'Failed to fetch and upload image')
    } finally {
      setFetchingImage(null)
    }
  }

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const article = articles[index]
    const oldBlobUrl = article.ogImageUrl?.includes('blob.vercel-storage.com') ? article.ogImageUrl : null

    setUploadingImage(index)

    try {
      // Create FormData and append file
      const formData = new FormData()
      formData.append('file', file)
      if (oldBlobUrl) {
        formData.append('oldBlobUrl', oldBlobUrl)
      }

      // Upload to Vercel Blob
      const response = await fetch('/api/portfolio/upload-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update the article with the Vercel Blob URL
      updateArticle(index, 'ogImageUrl', data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploadingImage(null)
    }
  }

  const deleteArticle = (index: number) => {
    const updated = articles.filter((_, i) => i !== index)
    updated.forEach((article, i) => { article.order = i })
    onChange(updated)
  }

  const moveArticle = (index: number, direction: 'up' | 'down') => {
    const newArticles = [...articles]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < articles.length) {
      [newArticles[index], newArticles[newIndex]] = [newArticles[newIndex], newArticles[index]]
      newArticles.forEach((article, i) => { article.order = i })
      onChange(newArticles)
    }
  }

  return (
    <ListManager
      title="Articles"
      items={articles}
      onAdd={addArticle}
      onUpdate={updateArticle}
      onDelete={deleteArticle}
      onMove={moveArticle}
      renderItem={(article, index) => (
        <div className="space-y-4">
          <FormField
            label="Article Title"
            value={article.title}
            onChange={(value) => updateArticle(index, 'title', value)}
            placeholder="Main title of the article"
          />
          
          <FormField
            label="Subtitle (optional)"
            value={article.subtitle || ''}
            onChange={(value) => updateArticle(index, 'subtitle', value)}
            placeholder="Secondary title or tagline"
          />
          
          <FormField
            label="Excerpt"
            type="textarea"
            value={article.excerpt || ''}
            onChange={(value) => updateArticle(index, 'excerpt', value)}
            placeholder="Brief description of the article"
            rows={3}
          />
          
          <FormField
            label="Article URL"
            type="url"
            value={article.url}
            onChange={(value) => updateArticle(index, 'url', value)}
            placeholder="https://..."
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Article Image (optional) - Recommended: 1200x630px
            </label>
            <div className="space-y-3">
              {/* Image Preview */}
              {article.ogImageUrl && (
                <div className="flex items-center gap-4">
                  <div className="w-48 h-24 rounded overflow-hidden bg-gray-200 border border-gray-300">
                    <img src={article.ogImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => updateArticle(index, 'ogImageUrl', '')}
                    disabled={uploadingImage === index || fetchingImage === index}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <label className={`cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${uploadingImage === index ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload size={18} />
                  {uploadingImage === index ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => handleImageUpload(index, e)}
                    disabled={uploadingImage === index}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-500">PNG, JPG, WebP (max 5MB)</span>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-sm text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* URL Fetch Option */}
              <div className="space-y-2">
                <FormField
                  label="Fetch from URL"
                  type="url"
                  value={article.ogImageUrl || ''}
                  onChange={(value) => updateArticle(index, 'ogImageUrl', value)}
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => fetchAndStoreImage(index)}
                  disabled={fetchingImage === index || !article.ogImageUrl}
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  {fetchingImage === index ? '📥 Fetching...' : '📥 Fetch & Store'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Published Date"
              type="date"
              value={article.publishedDate}
              onChange={(value) => updateArticle(index, 'publishedDate', value)}
            />
            <FormField
              label="Read Time (optional)"
              value={article.readTime || ''}
              onChange={(value) => updateArticle(index, 'readTime', value)}
              placeholder="e.g., 5 min read"
            />
          </div>
          
          <FormField
            label="Tags (comma-separated, optional)"
            value={article.tags?.join(', ') || ''}
            onChange={(value) => {
              const tags = value ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : []
              updateArticle(index, 'tags', tags)
            }}
            placeholder="e.g., technology, leadership, innovation"
          />
        </div>
      )}
    />
  )
}
