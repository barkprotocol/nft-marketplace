import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });
  console.log('User created:', user);

  // Fetch all users
  const allUsers = await prisma.user.findMany();
  console.log('All users:', allUsers);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
