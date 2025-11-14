// app/api/showcase/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { put, del } from '@vercel/blob'

// POST - Protected endpoint to upload image file to Vercel Blob
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const oldBlobUrl = formData.get('oldBlobUrl') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image is too large (max 5MB)' },
        { status: 400 }
      )
    }

    // Get file extension
    const extension = file.type.split('/')[1].split(';')[0]
    const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp']
    const fileExtension = validExtensions.includes(extension) ? extension : 'jpg'

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `showcase/showcase-${timestamp}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    })

    // Delete old blob if provided
    if (oldBlobUrl && oldBlobUrl.includes('blob.vercel-storage.com')) {
      try {
        await del(oldBlobUrl)
      } catch (error) {
        console.error('Error deleting old blob:', error)
        // Don't fail the request if cleanup fails
      }
    }

    return NextResponse.json({
      success: true,
      url: blob.url
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
