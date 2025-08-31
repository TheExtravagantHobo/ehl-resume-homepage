const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askPassword() {
  return new Promise((resolve) => {
    rl.question('Enter admin password: ', (password) => {
      resolve(password)
    })
  })
}

async function main() {
  console.log('Setting up admin account...')
  const password = await askPassword()
  
  if (password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@theextravaganthobo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@theextravaganthobo.com',
      password: hashedPassword,
    },
  })
  
  console.log('Admin account created/updated successfully!')
  rl.close()
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())