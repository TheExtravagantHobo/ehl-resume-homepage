// app/api/resume/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get all resume data
    const resume = await prisma.resume.findFirst()
    const education = await prisma.education.findMany({ orderBy: { order: 'asc' } })
    const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } })
    const publications = await prisma.publication.findMany({ orderBy: { order: 'asc' } })
    const languages = await prisma.language.findMany({ orderBy: { order: 'asc' } })
    const articles = await prisma.article.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

    return NextResponse.json({
      ...resume,
      education,
      experiences,
      skills,
      publications,
      languages,
      articles
    })
  } catch (error) {
    console.error('Error fetching resume data:', error)
    return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Update resume basic info
    const { education, experiences, skills, publications, languages, articles, ...resumeData } = data
    
    // Remove theme from resumeData since we're not using it anymore
    const { theme, ...cleanResumeData } = resumeData
    
    await prisma.resume.upsert({
      where: { id: data.id || 'default' },
      update: cleanResumeData,
      create: { ...cleanResumeData, id: 'default' }
    })

    // Update education (delete all and recreate)
    await prisma.education.deleteMany()
    if (education && education.length > 0) {
      await prisma.education.createMany({
        data: education.map((edu: any, index: number) => ({
          id: edu.id || `edu_${Date.now()}_${index}`,
          schoolName: edu.schoolName || '',
          degree: edu.degree || '',
          major: edu.major || '',
          location: edu.location || '',
          yearsAttended: edu.yearsAttended || '',
          order: index
        }))
      })
    }

    // Update experiences - handle both old and new format
    await prisma.experience.deleteMany()
    if (experiences && experiences.length > 0) {
      await prisma.experience.createMany({
        data: experiences.map((exp: any, index: number) => {
          // Calculate dateRange from dates if available
          let dateRange = exp.dateRange || ''
          if (exp.startDate) {
            const startYear = new Date(exp.startDate).getFullYear()
            if (exp.isCurrent) {
              dateRange = `${startYear} - Present`
            } else if (exp.endDate) {
              const endYear = new Date(exp.endDate).getFullYear()
              dateRange = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`
            } else {
              dateRange = `${startYear}`
            }
          }

          return {
            id: exp.id || `exp_${Date.now()}_${index}`,
            jobTitle: exp.jobTitle || '',
            company: exp.company || '',
            duties: exp.duties || [],
            fullBullets: exp.fullBullets || [],
            workLocation: exp.workLocation || null,
            // Use existing dates or create defaults
            startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
            endDate: exp.endDate && !exp.isCurrent ? new Date(exp.endDate) : null,
            isCurrent: exp.isCurrent || false,
            dateRange: dateRange,
            // Address fields
            street: exp.street || null,
            city: exp.city || null,
            state: exp.state || null,
            zipCode: exp.zipCode || null,
            order: index
          }
        })
      })
    }

    // Update skills
    await prisma.skill.deleteMany()
    if (skills && skills.length > 0) {
      await prisma.skill.createMany({
        data: skills.map((skill: any, index: number) => ({
          id: skill.id || `skill_${Date.now()}_${index}`,
          name: skill.name || '',
          level: skill.level || 5,
          hoverText: skill.hoverText || '',
          order: index
        }))
      })
    }

    // Update publications
    await prisma.publication.deleteMany()
    if (publications && publications.length > 0) {
      await prisma.publication.createMany({
        data: publications.map((pub: any, index: number) => ({
          id: pub.id || `pub_${Date.now()}_${index}`,
          title: pub.title || '',
          year: pub.year || '',
          order: index
        }))
      })
    }

    // Update languages
    await prisma.language.deleteMany()
    if (languages && languages.length > 0) {
      await prisma.language.createMany({
        data: languages.map((lang: any, index: number) => ({
          id: lang.id || `lang_${Date.now()}_${index}`,
          name: lang.name || '',
          proficiency: lang.proficiency || '',
          order: index
        }))
      })
    }

    // Update articles (only if table exists)
    try {
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
    } catch (error) {
      // Article table might not exist yet, that's ok
      console.log('Articles table not ready yet')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating resume data:', error)
    return NextResponse.json({ 
      error: 'Failed to update resume data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}