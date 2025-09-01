// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    return NextResponse.json([])  // Return empty array if error
  }
}