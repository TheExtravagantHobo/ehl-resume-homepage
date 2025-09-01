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
      name: 'Alex Sonne',
      title: 'TX Resident • Relocating',
      bio: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and program management.',
      email: 'admin@theextravaganthobo.com',
      signalUrl: 'https://signal.me/#eu/bcnUjsA0r099kIP8lX0v5b4xvcIDQzDSGWUC75cecgZjiihZa3BG7pFAnz_DD4Zz',
      linkedinPersonal: 'https://www.linkedin.com/in/alexsonne/',
      linkedinBusiness: 'https://www.linkedin.com/company/theextravaganthobo/',
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