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
    const certifications = await prisma.certification.findMany({ orderBy: { order: 'asc' } }).catch(() => [])
    const articles = await prisma.article.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

    // Format experiences dates for the admin panel
    const formattedExperiences = experiences.map(exp => ({
      ...exp,
      // Convert DateTime to string format (YYYY-MM-DD) for the admin panel
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
    }))

    // Format certifications dates
    const formattedCertifications = certifications.map(cert => ({
      ...cert,
      certDate: cert.certDate ? new Date(cert.certDate).toISOString().split('T')[0] : ''
    }))

    // Format articles dates
    const formattedArticles = articles.map(article => ({
      ...article,
      publishedDate: article.publishedDate ? new Date(article.publishedDate).toISOString().split('T')[0] : ''
    }))

    return NextResponse.json({
      ...resume,
      education,
      experiences: formattedExperiences,
      skills,
      publications,
      languages,
      certifications: formattedCertifications,
      articles: formattedArticles
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

    // Update resume basic info - MUST extract certifications here
    const { education, experiences, skills, publications, languages, certifications, articles, ...resumeData } = data
    
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
          // Parse dates properly
          const startDate = exp.startDate ? new Date(exp.startDate) : new Date()
          const endDate = exp.endDate && !exp.isCurrent ? new Date(exp.endDate) : null
          
          // Calculate dateRange from the actual dates
          const startYear = startDate.getFullYear()
          let dateRange = `${startYear}`
          
          if (exp.isCurrent) {
            dateRange = `${startYear} - Present`
          } else if (endDate) {
            const endYear = endDate.getFullYear()
            dateRange = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`
          }

          return {
            id: exp.id || `exp_${Date.now()}_${index}`,
            jobTitle: exp.jobTitle || '',
            company: exp.company || '',
            duties: exp.duties || [],
            fullBullets: exp.fullBullets || [],
            workLocation: exp.workLocation || null,
            startDate: startDate,
            endDate: endDate,
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

    // Update certifications
    try {
      await prisma.certification.deleteMany()
      if (certifications && certifications.length > 0) {
        await prisma.certification.createMany({
          data: certifications.map((cert: any, index: number) => ({
            id: cert.id || `cert_${Date.now()}_${index}`,
            name: cert.name || '',
            agency: cert.agency || '',
            certNumber: cert.certNumber || null,
            certDate: cert.certDate ? new Date(cert.certDate) : new Date(),
            agencyUrl: cert.agencyUrl || null,
            iconUrl: cert.iconUrl || null,
            order: index
          }))
        })
      }
    } catch (error) {
      console.log('Certifications table not ready yet')
    }

    // Update articles
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