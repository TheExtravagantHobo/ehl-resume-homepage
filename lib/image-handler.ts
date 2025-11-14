// lib/image-handler.ts

/**
 * Simple image handler for storing images in public folder
 * For personal site with non-sensitive images
 */

import fs from 'fs/promises'
import path from 'path'

export class ImageHandler {
  private static readonly UPLOAD_DIR = './public/uploads'
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  private static readonly MAX_SIZE = 5 * 1024 * 1024 // 5MB

  /**
   * Ensure upload directory exists
   */
  static async ensureUploadDir() {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads')
    try {
      await fs.access(uploadPath)
    } catch {
      await fs.mkdir(uploadPath, { recursive: true })
    }
  }

  /**
   * Save base64 image to public folder
   */
  static async saveImage(base64Data: string, filename: string): Promise<string> {
    try {
      // Ensure upload directory exists
      await this.ensureUploadDir()

      // Extract image data from base64 string
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/)
      if (!matches) {
        throw new Error('Invalid base64 image data')
      }

      const mimeType = matches[1]
      const data = matches[2]

      // Validate file type
      if (!this.ALLOWED_TYPES.includes(mimeType)) {
        throw new Error(`Invalid file type. Allowed: ${this.ALLOWED_TYPES.join(', ')}`)
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(data, 'base64')

      // Check file size
      if (buffer.length > this.MAX_SIZE) {
        throw new Error(`File too large. Maximum size: ${this.MAX_SIZE / 1024 / 1024}MB`)
      }

      // Generate unique filename
      const extension = mimeType.split('/')[1]
      const uniqueFilename = `${filename}-${Date.now()}.${extension}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename)

      // Save file - convert Buffer to Uint8Array for fs.writeFile
      await fs.writeFile(filePath, new Uint8Array(buffer))

      // Return public URL
      return `/uploads/${uniqueFilename}`
    } catch (error) {
      console.error('Error saving image:', error)
      throw error
    }
  }

  /**
   * Delete image from public folder
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl.startsWith('/uploads/')) {
        return // Not a local upload, skip
      }

      const filename = imageUrl.replace('/uploads/', '')
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
      
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting image:', error)
      // Don't throw, just log - image might already be deleted
    }
  }

  /**
   * Clean up old unused images (optional maintenance task)
   */
  static async cleanupOldImages(daysOld = 30): Promise<void> {
    try {
      const uploadPath = path.join(process.cwd(), 'public', 'uploads')
      const files = await fs.readdir(uploadPath)
      const now = Date.now()
      const maxAge = daysOld * 24 * 60 * 60 * 1000

      for (const file of files) {
        const filePath = path.join(uploadPath, file)
        const stats = await fs.stat(filePath)
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath)
          console.log(`Deleted old image: ${file}`)
        }
      }
    } catch (error) {
      console.error('Error cleaning up images:', error)
    }
  }
}