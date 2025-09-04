//prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('ChooseAStrongPasswordHere', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@sitename.com' },
    update: {},
    create: {
      email: 'admin@sitename.com',
      password: hashedPassword,
    },
  })

  // Create initial resume data
  await prisma.resume.create({
    data: {
      name: 'Name Name',
      title: 'TX Resident • Relocating',
      bio: 'Strategic leader bridging technology and policy with expertise in AI/ML, defense tech, and program management.',
      email: 'admin@sitename.com',
      signalUrl: 'https://signal.me/',
      linkedinPersonal: 'https://www.linkedin.com/in/NameName/',
      linkedinBusiness: 'https://www.linkedin.com/company/sitename/',
      theme: 'light-modern',
    },
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())