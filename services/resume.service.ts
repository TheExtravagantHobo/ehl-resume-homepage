// services/resume.service.ts

import { PrismaClient } from '@prisma/client'
import { cache } from '@/lib/cache'
import { validateData, FullResumeSchema } from '@/lib/validation'
import { ImageHandler } from '@/lib/image-handler'

// ============================================
// PRISMA SINGLETON
// ============================================

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ============================================
// RESUME SERVICE
// ============================================

export class ResumeService {
  private static readonly CACHE_KEY = 'resume-data'
  private static readonly CACHE_TTL = 60 * 60 // 1 hour

  /**
   * Get complete resume data with optimized query
   */
  static async getResume() {
    // Try cache first
    const cached = await cache.get(this.CACHE_KEY)
    if (cached) {
      return cached
    }

    try {
      // Single optimized query with all relations
      const resume = await prisma.resume.findFirst({
        where: { id: 'default' }
      })

      // Parallel queries for better performance
      const [
        education,
        experiences,
        skills,
        publications,
        languages,
        certifications,
        articles
      ] = await Promise.all([
        prisma.education.findMany({ orderBy: { order: 'asc' } }),
        prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        prisma.skill.findMany({ orderBy: { order: 'asc' } }),
        prisma.publication.findMany({ orderBy: { order: 'asc' } }),
        prisma.language.findMany({ orderBy: { order: 'asc' } }),
        prisma.certification.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
        prisma.article.findMany({ orderBy: { order: 'asc' } }).catch(() => [])
      ])

      // Format dates for frontend
      const formattedExperiences = experiences.map(exp => ({
        ...exp,
        startDate: exp.startDate ? exp.startDate.toISOString().split('T')[0] : '',
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : ''
      }))

      const formattedCertifications = certifications.map(cert => ({
        ...cert,
        certDate: cert.certDate ? cert.certDate.toISOString().split('T')[0] : ''
      }))

      const formattedArticles = articles.map(article => ({
        ...article,
        publishedDate: article.publishedDate ? article.publishedDate.toISOString().split('T')[0] : ''
      }))

      const completeResume = {
        ...resume,
        education,
        experiences: formattedExperiences,
        skills,
        publications,
        languages,
        certifications: formattedCertifications,
        articles: formattedArticles
      }

      // Cache the result
      await cache.set(this.CACHE_KEY, completeResume, this.CACHE_TTL)

      return completeResume
    } catch (error) {
      console.error('Error fetching resume:', error)
      throw new Error('Failed to fetch resume data')
    }
  }

  /**
   * Update resume with validation and caching
   */
  static async updateResume(data: any) {
    // Validate input data
    const validation = validateData(FullResumeSchema, data)
    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`)
    }

    const validatedData = validation.data!

    try {
      // Handle image upload if base64 is provided
      if (validatedData.photoUrl?.startsWith('data:')) {
        const imageUrl = await ImageHandler.saveImage(validatedData.photoUrl, 'profile')
        validatedData.photoUrl = imageUrl
      }

      // Start transaction for data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Extract nested data
        const { 
          education, 
          experiences, 
          skills, 
          publications, 
          languages, 
          certifications, 
          articles, 
          ...resumeData 
        } = validatedData

        // Update resume basic info
        await tx.resume.upsert({
          where: { id: resumeData.id || 'default' },
          update: resumeData,
          create: { ...resumeData, id: 'default' }
        })

        // Update related data with delete-and-recreate pattern
        // This ensures clean data without orphans

        // Education
        await tx.education.deleteMany()
        if (education?.length) {
          await tx.education.createMany({
            data: education.map((edu, index) => ({
              ...edu,
              order: index
            }))
          })
        }

        // Experiences
        await tx.experience.deleteMany()
        if (experiences?.length) {
          await tx.experience.createMany({
            data: experiences.map((exp, index) => {
              // Calculate dateRange from dates
              const startDate = new Date(exp.startDate)
              const endDate = exp.endDate ? new Date(exp.endDate) : null
              
              let dateRange = ''
              if (exp.isCurrent) {
                dateRange = `${startDate.getFullYear()} - Present`
              } else if (endDate) {
                const startYear = startDate.getFullYear()
                const endYear = endDate.getFullYear()
                dateRange = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`
              } else {
                dateRange = `${startDate.getFullYear()}`
              }
              
              return {
                ...exp,
                startDate,
                endDate,
                dateRange, // Now included
                order: index
              }
            })
          })
        }

        // Skills
        await tx.skill.deleteMany()
        if (skills?.length) {
          await tx.skill.createMany({
            data: skills.map((skill, index) => ({
              ...skill,
              order: index
            }))
          })
        }

        // Publications
        await tx.publication.deleteMany()
        if (publications?.length) {
          await tx.publication.createMany({
            data: publications.map((pub, index) => ({
              ...pub,
              order: index
            }))
          })
        }

        // Languages
        await tx.language.deleteMany()
        if (languages?.length) {
          await tx.language.createMany({
            data: languages.map((lang, index) => ({
              ...lang,
              order: index
            }))
          })
        }

        // Certifications
        await tx.certification.deleteMany()
        if (certifications?.length) {
          await tx.certification.createMany({
            data: certifications.map((cert, index) => ({
              ...cert,
              certDate: new Date(cert.certDate),
              order: index
            }))
          })
        }

        // Articles
        await tx.article.deleteMany()
        if (articles?.length) {
          await tx.article.createMany({
            data: articles.map((article, index) => ({
              ...article,
              publishedDate: new Date(article.publishedDate),
              order: article.order ?? index  // Provide default order value
            }))
          })
        }
        return { success: true }
      })

      // Invalidate cache after successful update
      await cache.delete(this.CACHE_KEY)

      return result
    } catch (error) {
      console.error('Error updating resume:', error)
      throw new Error('Failed to update resume data')
    }
  }

  /**
   * Get specific section of resume
   */
  static async getSection(section: string) {
    const cacheKey = `resume-section-${section}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return cached
    }

    try {
      // Map section names to Prisma model methods
      const sectionMap: Record<string, () => Promise<any>> = {
        'education': () => prisma.education.findMany({ orderBy: { order: 'asc' } }),
        'experience': () => prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        'experiences': () => prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        'skill': () => prisma.skill.findMany({ orderBy: { order: 'asc' } }),
        'skills': () => prisma.skill.findMany({ orderBy: { order: 'asc' } }),
        'publication': () => prisma.publication.findMany({ orderBy: { order: 'asc' } }),
        'publications': () => prisma.publication.findMany({ orderBy: { order: 'asc' } }),
        'language': () => prisma.language.findMany({ orderBy: { order: 'asc' } }),
        'languages': () => prisma.language.findMany({ orderBy: { order: 'asc' } }),
        'certification': () => prisma.certification.findMany({ orderBy: { order: 'asc' } }),
        'certifications': () => prisma.certification.findMany({ orderBy: { order: 'asc' } }),
        'article': () => prisma.article.findMany({ orderBy: { order: 'asc' } }),
        'articles': () => prisma.article.findMany({ orderBy: { order: 'asc' } }),
      }
      
      const queryFn = sectionMap[section.toLowerCase()]
      if (!queryFn) {
        throw new Error(`Invalid section: ${section}`)
      }
      
      const data = await queryFn()
      
      await cache.set(cacheKey, data, this.CACHE_TTL)
      return data
    } catch (error) {
      console.error(`Error fetching ${section}:`, error)
      throw new Error(`Failed to fetch ${section} data`)
    }
  }

  /**
   * Clear all resume-related cache
   */
  static async clearCache() {
    await cache.deletePattern('resume-*')
  }
}