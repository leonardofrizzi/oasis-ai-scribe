import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDB() {
  await prisma.$connect();
  console.log("Connected to Postgres via Prisma");
}