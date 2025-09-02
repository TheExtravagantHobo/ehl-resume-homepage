// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  } finally {
    await prisma.$disconnect()
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
    
    // Delete all existing articles and recreate
    // This ensures the admin panel is the single source of truth
    await prisma.article.deleteMany()
    
    if (articles && articles.length > 0) {
      await prisma.article.createMany({
        data: articles.map((article: any) => ({
          id: article.id || `article_${Date.now()}_${article.order}`,
          title: article.title || '',
          subtitle: article.subtitle || null,
          excerpt: article.excerpt || '',
          url: article.url || '',
          ogImageUrl: article.ogImageUrl || null,
          publishedDate: article.publishedDate ? new Date(article.publishedDate) : new Date(),
          readTime: article.readTime || null,
          tags: article.tags || [],
          order: article.order || 0
        }))
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating articles:', error)
    return NextResponse.json({ 
      error: 'Failed to update articles', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
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
        id: article.id || `article_${Date.now()}`,
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
  } finally {
    await prisma.$disconnect()
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
  } finally {
    await prisma.$disconnect()
  }
}