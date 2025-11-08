import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'demo@mvpforge.com', name: 'Demo User', plan: 'pro' },
      { email: 'free@mvpforge.com', name: 'Free User', plan: 'free' },
      { email: 'docteur@codegeek-pro.me', name: 'Owner', plan: 'pro' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
