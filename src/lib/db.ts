import prisma from "./prisma";

export async function getUserId(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function createBatchQuery<T>(
  items: T[],
  batchSize: number = 100
) {
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}