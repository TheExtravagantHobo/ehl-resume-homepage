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

    return NextResponse.json({
      ...resume,
      education,
      experiences,
      skills,
      publications,
      languages
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
    const { education, experiences, skills, publications, languages, ...resumeData } = data
    
    await prisma.resume.upsert({
      where: { id: data.id || 'default' },
      update: resumeData,
      create: { ...resumeData, id: 'default' }
    })

    // Update education (delete all and recreate)
    await prisma.education.deleteMany()
    if (education && education.length > 0) {
      await prisma.education.createMany({
        data: education.map((edu: any, index: number) => ({
          ...edu,
          order: index
        }))
      })
    }

    // Update experiences
    await prisma.experience.deleteMany()
    if (experiences && experiences.length > 0) {
      await prisma.experience.createMany({
        data: experiences.map((exp: any, index: number) => ({
          ...exp,
          order: index
        }))
      })
    }

    // Update skills
    await prisma.skill.deleteMany()
    if (skills && skills.length > 0) {
      await prisma.skill.createMany({
        data: skills.map((skill: any, index: number) => ({
          ...skill,
          order: index
        }))
      })
    }

    // Update publications
    await prisma.publication.deleteMany()
    if (publications && publications.length > 0) {
      await prisma.publication.createMany({
        data: publications.map((pub: any, index: number) => ({
          ...pub,
          order: index
        }))
      })
    }

    // Update languages
    await prisma.language.deleteMany()
    if (languages && languages.length > 0) {
      await prisma.language.createMany({
        data: languages.map((lang: any, index: number) => ({
          ...lang,
          order: index
        }))
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating resume data:', error)
    return NextResponse.json({ error: 'Failed to update resume data' }, { status: 500 })
  }
}