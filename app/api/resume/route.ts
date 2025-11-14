// app/api/resume/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET all resume data (public endpoint)
export async function GET() {
  try {
    console.log('Fetching resume data...')
    
    const [
      resume,
      education,
      experience,
      skills,
      publications,
      languages,
      certifications
    ] = await Promise.all([
      prisma.resume.findFirst(),
      prisma.education.findMany({ orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.publication.findMany({ orderBy: { order: 'asc' } }),
      prisma.language.findMany({ orderBy: { order: 'asc' } }),
      prisma.certification.findMany({ orderBy: { order: 'asc' } })
    ])

    const data = {
      // Spread the resume data directly (not nested)
      ...(resume || {
        name: '',
        title: '',
        bio: '',
        email: '',
        signalUrl: '',
        linkedinPersonal: '',
        linkedinBusiness: '',
        photoUrl: '',
        theme: 'light-modern',
        showMission: false,
        missionTitle: '',
        missionText: ''
      }),
      // Add arrays with correct naming
      education,
      experiences: experience,  // Note: renamed to 'experiences' to match frontend
      skills,
      publications,
      languages,
      certifications
    }

    console.log('Resume data fetched successfully:', {
      hasResume: !!resume,
      educationCount: education.length,
      experienceCount: experience.length,
      skillsCount: skills.length,
      publicationsCount: publications.length,
      languagesCount: languages.length,
      certificationsCount: certifications.length
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching resume data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resume data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST resume data (protected endpoint)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    console.log('Saving resume data:', data)

    // Use transactions for atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Update or create resume
      if (data.resume) {
        const existingResume = await tx.resume.findFirst()
        if (existingResume) {
          await tx.resume.update({
            where: { id: existingResume.id },
            data: {
              name: data.resume.name || '',
              title: data.resume.title || '',
              bio: data.resume.bio || '',
              email: data.resume.email || '',
              signalUrl: data.resume.signalUrl || '',
              linkedinPersonal: data.resume.linkedinPersonal || '',
              linkedinBusiness: data.resume.linkedinBusiness || '',
              photoUrl: data.resume.photoUrl || '',
              theme: data.resume.theme || 'light-modern',
              showMission: data.resume.showMission || false,
              missionTitle: data.resume.missionTitle || '',
              missionText: data.resume.missionText || ''
            }
          })
        } else {
          await tx.resume.create({
            data: {
              name: data.resume.name || '',
              title: data.resume.title || '',
              bio: data.resume.bio || '',
              email: data.resume.email || '',
              signalUrl: data.resume.signalUrl || '',
              linkedinPersonal: data.resume.linkedinPersonal || '',
              linkedinBusiness: data.resume.linkedinBusiness || '',
              photoUrl: data.resume.photoUrl || '',
              theme: data.resume.theme || 'light-modern',
              showMission: data.resume.showMission || false,
              missionTitle: data.resume.missionTitle || '',
              missionText: data.resume.missionText || ''
            }
          })
        }
      }

      // Update education
      if (data.education) {
        await tx.education.deleteMany()
        if (data.education.length > 0) {
          await tx.education.createMany({
            data: data.education.map((edu: any, index: number) => ({
              schoolName: edu.schoolName,
              degree: edu.degree,
              major: edu.major,
              location: edu.location,
              yearsAttended: edu.yearsAttended,
              order: edu.order ?? index
            }))
          })
        }
      }

      // Update experience
      if (data.experience) {
        await tx.experience.deleteMany()
        if (data.experience.length > 0) {
          // Validate that all experiences have required dates
          for (const exp of data.experience) {
            if (!exp.startDate || exp.startDate.trim() === '') {
              throw new Error(`Experience "${exp.jobTitle}" is missing a start date`)
            }
            // If not current, must have end date
            if (!exp.isCurrent && (!exp.endDate || exp.endDate.trim() === '')) {
              throw new Error(`Experience "${exp.jobTitle}" is not current but missing an end date`)
            }
          }

          await tx.experience.createMany({
            data: data.experience.map((exp: any, index: number) => ({
              jobTitle: exp.jobTitle,
              company: exp.company,
              duties: exp.duties || [],
              fullBullets: exp.fullBullets || [],
              workLocation: exp.workLocation,
              startDate: new Date(exp.startDate),
              endDate: exp.isCurrent ? null : new Date(exp.endDate),
              isCurrent: exp.isCurrent || false,
              dateRange: exp.dateRange || '',
              street: exp.street,
              city: exp.city,
              state: exp.state,
              zipCode: exp.zipCode,
              order: exp.order ?? index
            }))
          })
        }
      }

      // Update skills
      if (data.skills) {
        await tx.skill.deleteMany()
        if (data.skills.length > 0) {
          await tx.skill.createMany({
            data: data.skills.map((skill: any, index: number) => ({
              name: skill.name,
              level: skill.level,
              hoverText: skill.hoverText,
              order: skill.order ?? index
            }))
          })
        }
      }

      // Update publications
      if (data.publications) {
        await tx.publication.deleteMany()
        if (data.publications.length > 0) {
          await tx.publication.createMany({
            data: data.publications.map((pub: any, index: number) => ({
              title: pub.title,
              year: pub.year,
              order: pub.order ?? index
            }))
          })
        }
      }

      // Update languages
      if (data.languages) {
        await tx.language.deleteMany()
        if (data.languages.length > 0) {
          await tx.language.createMany({
            data: data.languages.map((lang: any, index: number) => ({
              name: lang.name,
              proficiency: lang.proficiency,
              order: lang.order ?? index
            }))
          })
        }
      }

      // Update certifications
      if (data.certifications) {
        await tx.certification.deleteMany()
        if (data.certifications.length > 0) {
          await tx.certification.createMany({
            data: data.certifications.map((cert: any, index: number) => ({
              name: cert.name,
              agency: cert.agency,
              certNumber: cert.certNumber,
              certDate: cert.certDate ? new Date(cert.certDate) : new Date(),
              agencyUrl: cert.agencyUrl,
              iconUrl: cert.iconUrl,
              order: cert.order ?? index
            }))
          })
        }
      }

      return { success: true }
    })

    console.log('Resume data saved successfully')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error saving resume data:', error)
    return NextResponse.json(
      { error: 'Failed to save resume data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}