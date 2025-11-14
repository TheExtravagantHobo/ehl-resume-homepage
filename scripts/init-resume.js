// scripts/init-resume.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create initial resume data
  await prisma.resume.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Jane Developer',
      title: 'Your Location',
      bio: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and program management.',
      email: 'admin@example.com',
      signalUrl: 'https://signal.me/#p/your-signal-url',
      linkedinPersonal: 'https://www.linkedin.com/in/janedeveloper/',
      linkedinBusiness: 'https://www.linkedin.com/company/your-company/',
      showMission: false,
      missionTitle: 'Mission',
      missionText: ''
    },
  })

  console.log('Resume initialized successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })