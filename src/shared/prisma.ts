import { PrismaClient } from "@prisma/client";
import { initiateSuperAdmin } from "../app/db/db";

const prisma = new PrismaClient();

async function connectPrisma() {
  try {
    await prisma.$connect();

    initiateSuperAdmin();
  } catch (error) {
    console.error("Prisma connection failed:", error);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

connectPrisma();

export default prisma;
