// prisma/seed.ts
import prisma from "../src/lib/prisma";

async function main() {
  const u = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Tester",
    },
  });
  await prisma.expense.create({
    data: {
      userId: u.id,
      amount: 9.99,
      category: "food",
      description: "coffee",
    },
  });
  console.log("Seed finished");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
