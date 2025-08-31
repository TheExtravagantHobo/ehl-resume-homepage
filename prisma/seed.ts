//prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('ChooseAStrongPasswordHere', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@theextravaganthobo.com' },
    update: {},
    create: {
      email: 'admin@theextravaganthobo.com',
      password: hashedPassword,
    },
  })

  // Create initial resume data
  await prisma.resume.create({
    data: {
      name: 'Alex Sonne',
      title: 'TX Resident • Relocating',
      bio: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and innovation management.',
      email: 'admin@theextravaganthobo.com',
      signalUrl: 'https://signal.me/#eu/bcnUjsA0r099kIP8lX0v5b4xvcIDQzDSGWUC75cecgZjiihZa3BG7pFAnz_DD4Zz',
      linkedinPersonal: 'https://www.linkedin.com/in/alexsonne/',
      linkedinBusiness: 'https://www.linkedin.com/company/theextravaganthobo/',
      theme: 'light-modern',
    },
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())