// app/api/showcase/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Public endpoint to fetch showcase items
export async function GET(request: NextRequest) {
  try {
    const showcaseItems = await prisma.showcase.findMany({ 
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6 // Maximum 6 items
    })
    
    console.log(`Found ${showcaseItems.length} showcase items in database`)
    return NextResponse.json(showcaseItems)
  } catch (error) {
    console.error('Error fetching showcase items:', error)
    // Check if table exists
    if (error instanceof Error && error.message.includes('P2021')) {
      console.error('Showcase table does not exist. Run: npx prisma migrate dev')
      return NextResponse.json([], { status: 500 })
    }
    return NextResponse.json([], { status: 500 })
  } finally {
    await prisma.$disconnect()
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
    
    // Delete all existing showcase items and recreate
    await prisma.showcase.deleteMany()
    console.log('Deleted existing showcase items')
    
    if (showcaseItems && showcaseItems.length > 0) {
      // Limit to 6 items maximum
      const itemsToSave = showcaseItems.slice(0, 6)
      
      const created = await prisma.showcase.createMany({
        data: itemsToSave.map((item: any, index: number) => ({
          id: item.id || `showcase_${Date.now()}_${index}`,
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.imageUrl || null,
          linkUrl: item.linkUrl || '#',
          linkType: item.linkType || 'internal',
          order: item.order ?? index,
          isActive: item.isActive ?? true
        }))
      })
      
      console.log(`Created ${created.count} showcase items`)
    }
    
    return NextResponse.json({ success: true })
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
  } finally {
    await prisma.$disconnect()
  }
}