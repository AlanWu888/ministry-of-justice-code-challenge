import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: 'Visit the shops',
        description: 'Milk, eggs, bread',
        status: 'TODO',
        dueDate: new Date('2025-06-15T10:00:00Z'),
      },
      {
        title: 'Finish this project',
        description: 'Complete by Monday',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-06-23T17:00:00Z'),
      },
    ],
  })
  console.log('Seeded database!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
