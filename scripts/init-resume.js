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
      name: 'Name Name',
      title: 'TX Resident • Relocating',
      bio: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and program management.',
      email: 'admin@sitename.com',
      signalUrl: 'https://signal.me/',
      linkedinPersonal: 'https://www.linkedin.com/in/namename/',
      linkedinBusiness: 'https://www.linkedin.com/company/sitename/',
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