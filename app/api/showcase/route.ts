// app/api/showcase/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Public endpoint to fetch showcase items
export async function GET(request: NextRequest) {
  try {
    const showcaseItems = await prisma.showcase.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6 // Maximum 6 items
    })

    console.log(`Found ${showcaseItems.length} showcase items in database`)

    // Add cache headers for better performance
    // Cache for 1 hour, revalidate in background
    return NextResponse.json(showcaseItems, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching showcase items:', error)
    // Check if table exists
    if (error instanceof Error && error.message.includes('P2021')) {
      console.error('Showcase table does not exist. Run: npx prisma migrate dev')
      return NextResponse.json([], { status: 500 })
    }
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Protected endpoint to save showcase items
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const showcaseItems = await request.json()
    console.log('Received showcase items to save:', showcaseItems)

    // Use transaction for atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing showcase items
      await tx.showcase.deleteMany()
      console.log('Deleted existing showcase items')

      if (showcaseItems && showcaseItems.length > 0) {
        // Limit to 6 items maximum
        const itemsToSave = showcaseItems.slice(0, 6)

        const dataToSave = itemsToSave.map((item: any, index: number) => ({
          // Don't pass id - let Prisma auto-generate CUID
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.imageUrl || null,
          linkUrl: item.linkUrl || '#',
          linkType: item.linkType || 'internal',
          order: item.order ?? index,
          isActive: item.isActive ?? true
        }))

        console.log('[Showcase API] Data being saved to DB:', JSON.stringify(dataToSave, null, 2))

        // Create new items - let Prisma auto-generate CUIDs
        await tx.showcase.createMany({
          data: dataToSave
        })

        console.log(`Created ${itemsToSave.length} showcase items`)
      }

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating showcase items:', error)
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('P2021')) {
        return NextResponse.json({ 
          error: 'Showcase table does not exist. Run: npx prisma migrate dev',
          details: error.message
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      error: 'Failed to update showcase items',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}