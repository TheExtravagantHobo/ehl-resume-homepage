// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Public endpoint to fetch articles
export async function GET(request: NextRequest) {
  try {
    const articles = await prisma.article.findMany({ 
      orderBy: { order: 'asc' } 
    })
    
    // Format the dates to strings for the frontend
    const formattedArticles = articles.map(article => ({
      ...article,
      publishedDate: article.publishedDate ? new Date(article.publishedDate).toISOString() : '',
      tags: article.tags || []
    }))
    
    return NextResponse.json(formattedArticles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Protected endpoint to save articles (only from admin panel)
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const articles = await request.json()

    // Use transaction for atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing articles
      await tx.article.deleteMany()

      if (articles && articles.length > 0) {
        // Create new articles - let Prisma auto-generate CUIDs
        await tx.article.createMany({
          data: articles.map((article: any, index: number) => ({
            // Don't pass id - let Prisma auto-generate CUID
            title: article.title || '',
            subtitle: article.subtitle || null,
            excerpt: article.excerpt || '',
            url: article.url || '',
            ogImageUrl: article.ogImageUrl || null,
            publishedDate: article.publishedDate ? new Date(article.publishedDate) : new Date(),
            readTime: article.readTime || null,
            tags: article.tags || [],
            order: article.order ?? index
          }))
        })
      }

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating articles:', error)
    return NextResponse.json({
      error: 'Failed to update articles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Protected endpoint to update a single article
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const article = await request.json()

    const updated = await prisma.article.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        subtitle: article.subtitle,
        excerpt: article.excerpt,
        url: article.url,
        ogImageUrl: article.ogImageUrl,
        publishedDate: article.publishedDate ? new Date(article.publishedDate) : new Date(),
        readTime: article.readTime,
        tags: article.tags || [],
        order: article.order
      },
      create: {
        // Don't pass id - let Prisma auto-generate CUID
        title: article.title || '',
        subtitle: article.subtitle || null,
        excerpt: article.excerpt || '',
        url: article.url || '',
        ogImageUrl: article.ogImageUrl || null,
        publishedDate: article.publishedDate ? new Date(article.publishedDate) : new Date(),
        readTime: article.readTime || null,
        tags: article.tags || [],
        order: article.order || 0
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({
      error: 'Failed to update article',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Protected endpoint to delete a single article
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
    }
    
    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({
      error: 'Failed to delete article',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}