// app/api/portfolio/fetch-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { put, del } from '@vercel/blob'

// POST - Protected endpoint to fetch and upload image to Vercel Blob
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { imageUrl, oldBlobUrl } = await request.json()

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(imageUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Fetch the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Get the content type and validate it's an image
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL does not point to an image' },
        { status: 400 }
      )
    }

    // Download image
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Check file size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image is too large (max 5MB)' },
        { status: 400 }
      )
    }

    // Get file extension from content type
    const extension = contentType.split('/')[1].split(';')[0]
    const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp']
    const fileExtension = validExtensions.includes(extension) ? extension : 'jpg'

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `articles/article-${timestamp}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType,
    })

    // Delete old blob if provided
    if (oldBlobUrl && typeof oldBlobUrl === 'string' && oldBlobUrl.includes('blob.vercel-storage.com')) {
      try {
        await del(oldBlobUrl)
      } catch (error) {
        console.error('Error deleting old blob:', error)
        // Don't fail the request if cleanup fails
      }
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      originalUrl: imageUrl
    })
  } catch (error) {
    console.error('Error fetching and uploading image:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch and upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
