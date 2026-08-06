import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

/** Hot reload can keep an old Prisma client missing newly added models. */
function isStalePrismaClient(client: PrismaClient): boolean {
  return typeof (client as PrismaClient & { contentPost?: unknown }).contentPost === "undefined";
}

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;

  if (!globalForPrisma.prisma || isStalePrismaClient(globalForPrisma.prisma)) {
    if (globalForPrisma.prisma) {
      void globalForPrisma.prisma.$disconnect();
    }
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}
