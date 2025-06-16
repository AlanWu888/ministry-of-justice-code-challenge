const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "Task 1",
        description: "some description",
        dueDate: new Date(Date.now() + 3600 * 1000 * 24),
        status: "TODO",
        archived: false
      },
      {
        title: "Task 2",
        description: "some description",
        dueDate: new Date(Date.now() + 3600 * 1000 * 48),
        status: "IN_PROGRESS",
        archived: false
      },
      {
        title: "Task 3",
        description: "some description",
        dueDate: new Date(Date.now() + 3600 * 1000 * 24),
        status: "DONE",
        archived: false
      },
      {
        title: "Task 4",
        description: "some description",
        dueDate: new Date(Date.now() + 3600 * 1000 * 48),
        status: "DONE",
        archived: true
      },
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
