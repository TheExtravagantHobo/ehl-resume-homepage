//prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  })
  console.log('✓ Admin user created')

  // Create resume
  const resume = await prisma.resume.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Jane Developer',
      title: 'Full-Stack Developer & Technical Leader',
      bio: 'Experienced software engineer with 8+ years building scalable web applications and leading technical teams.',
      email: 'admin@example.com',
      signalUrl: 'https://signal.me/#p/+15551234567',
      linkedinPersonal: 'https://www.linkedin.com/in/janedeveloper/',
      linkedinBusiness: 'https://www.linkedin.com/company/techstartup/',
      theme: 'light-modern',
      showMission: true,
      missionTitle: 'Mission',
      missionText: 'To build elegant, user-focused software solutions that solve real-world problems and make technology more accessible to everyone.',
    },
  })
  console.log('✓ Resume created')

  // Create education entries
  const education = await Promise.all([
    prisma.education.create({
      data: {
        
        schoolName: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        major: 'Computer Science',
        location: 'Berkeley, CA',
        yearsAttended: '2011 - 2015',
        order: 0,
      },
    }),
    prisma.education.create({
      data: {
        
        schoolName: 'Stanford University',
        degree: 'Master of Science',
        major: 'Artificial Intelligence',
        location: 'Stanford, CA',
        yearsAttended: '2015 - 2017',
        order: 1,
      },
    }),
  ])
  console.log('✓ Education entries created')

  // Create experience entries
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        
        company: 'Tech Innovations Inc.',
        jobTitle: 'Senior Software Engineer',
        dateRange: 'Jan 2021 - Present',
        startDate: new Date('2021-01-01'),
        endDate: null,
        isCurrent: true,
        workLocation: 'hybrid',
        duties: [
          'Led development of microservices architecture',
          'Mentored team of 5 junior developers',
          'Improved application performance by 40%',
        ],
        fullBullets: [
          'Led development of microservices architecture serving 1M+ users',
          'Mentored team of 5 junior developers in best practices and code review',
          'Improved application performance by 40% through optimization and caching',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Collaborated with product team to deliver features on tight deadlines',
        ],
        order: 0,
      },
    }),
    prisma.experience.create({
      data: {
        
        company: 'StartupXYZ',
        jobTitle: 'Full-Stack Developer',
        dateRange: 'Jun 2018 - Dec 2020',
        startDate: new Date('2018-06-01'),
        endDate: new Date('2020-12-31'),
        isCurrent: false,
        workLocation: 'remote',
        duties: [
          'Built responsive web applications using React and Node.js',
          'Designed and implemented RESTful APIs',
          'Managed PostgreSQL database optimization',
        ],
        fullBullets: [
          'Built responsive web applications using React, Next.js, and Node.js',
          'Designed and implemented RESTful APIs serving 500K requests per day',
          'Managed PostgreSQL database optimization reducing query time by 50%',
          'Implemented comprehensive testing strategy (unit, integration, E2E)',
          'Collaborated with designers to create pixel-perfect UI components',
        ],
        order: 1,
      },
    }),
    prisma.experience.create({
      data: {
        
        company: 'Digital Solutions LLC',
        jobTitle: 'Junior Developer',
        dateRange: 'Jul 2017 - May 2018',
        startDate: new Date('2017-07-01'),
        endDate: new Date('2018-05-31'),
        isCurrent: false,
        workLocation: null,
        duties: [
          'Developed web features using JavaScript and Python',
          'Fixed bugs and maintained legacy codebases',
          'Participated in daily standups and sprint planning',
        ],
        fullBullets: [
          'Developed new features for customer-facing web applications',
          'Fixed critical bugs and maintained legacy codebases',
          'Participated in agile ceremonies (standups, retrospectives, planning)',
          'Wrote technical documentation for internal APIs',
          'Learned modern development practices and design patterns',
        ],
        order: 2,
      },
    }),
  ])
  console.log('✓ Experience entries created')

  // Create skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        
        name: 'JavaScript/TypeScript',
        level: 9,
        hoverText: '7+ years experience',
        order: 0,
      },
    }),
    prisma.skill.create({
      data: {
        
        name: 'React & Next.js',
        level: 9,
        hoverText: 'Expert in modern React patterns',
        order: 1,
      },
    }),
    prisma.skill.create({
      data: {
        
        name: 'Node.js & Express',
        level: 8,
        hoverText: '5+ years backend development',
        order: 2,
      },
    }),
    prisma.skill.create({
      data: {
        
        name: 'SQL & PostgreSQL',
        level: 8,
        hoverText: 'Database design & optimization',
        order: 3,
      },
    }),
    prisma.skill.create({
      data: {
        
        name: 'Python',
        level: 7,
        hoverText: 'Data processing & scripting',
        order: 4,
      },
    }),
    prisma.skill.create({
      data: {
        
        name: 'AWS & Cloud',
        level: 7,
        hoverText: 'EC2, S3, Lambda, CloudFront',
        order: 5,
      },
    }),
    prisma.skill.create({
      data: {
        
        name: 'Docker & CI/CD',
        level: 7,
        hoverText: 'Container orchestration',
        order: 6,
      },
    }),
  ])
  console.log('✓ Skills created')

  // Create languages
  const languages = await Promise.all([
    prisma.language.create({
      data: {
        
        name: 'English',
        proficiency: 'Native',
        order: 0,
      },
    }),
    prisma.language.create({
      data: {
        
        name: 'Spanish',
        proficiency: 'Professional',
        order: 1,
      },
    }),
  ])
  console.log('✓ Languages created')

  // Create certifications
  const certifications = await Promise.all([
    prisma.certification.create({
      data: {
        
        name: 'AWS Certified Solutions Architect',
        agency: 'Amazon Web Services',
        certNumber: 'AWS-12345',
        certDate: new Date('2023-03-15'),
        agencyUrl: 'https://aws.amazon.com/certification/',
        order: 0,
      },
    }),
    prisma.certification.create({
      data: {
        
        name: 'Professional Scrum Master I',
        agency: 'Scrum.org',
        certNumber: 'PSM-67890',
        certDate: new Date('2022-08-20'),
        agencyUrl: 'https://www.scrum.org/',
        order: 1,
      },
    }),
  ])
  console.log('✓ Certifications created')

  // Create publications
  const publications = await Promise.all([
    prisma.publication.create({
      data: {
        
        title: 'Optimizing React Performance in Large-Scale Applications',
        year: '2023',
        order: 0,
      },
    }),
    prisma.publication.create({
      data: {
        
        title: 'Microservices Architecture: Lessons Learned',
        year: '2022',
        order: 1,
      },
    }),
  ])
  console.log('✓ Publications created')

  // Create showcase items
  const showcaseItems = await Promise.all([
    prisma.showcase.create({
      data: {
        title: 'Interactive Resume',
        description: 'Explore my experience with an engaging, interactive timeline and expandable details.',
        linkUrl: '/resume',
        linkType: 'internal',
        order: 0,
        isActive: true,
      },
    }),
    prisma.showcase.create({
      data: {
        title: 'Portfolio',
        description: 'View my technical articles and projects spanning web development, cloud architecture, and more.',
        linkUrl: '/portfolio',
        linkType: 'internal',
        order: 1,
        isActive: true,
      },
    }),
    prisma.showcase.create({
      data: {
        title: 'Connect',
        description: "Let's discuss how I can contribute to your team's success.",
        linkUrl: 'mailto:admin@example.com',
        linkType: 'mailto',
        order: 2,
        isActive: true,
      },
    }),
  ])
  console.log('✓ Showcase items created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Login credentials:')
  console.log('   Email: admin@example.com')
  console.log('   Password: admin123')
  console.log('\n⚠️  Remember to change the password after first login!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())