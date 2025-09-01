//Adding Prisma client helper (avoid duplicate PrismaClient in dev)


// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global across module reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
