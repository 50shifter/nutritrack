import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let prisma: PrismaClient | null = null;

// Check if DATABASE_URL is a real production URL (not localhost/placeholder)
const rawUrl = process.env.DATABASE_URL || "";
const isDbConnected = rawUrl.startsWith("mongodb+") && 
                      !rawUrl.includes("localhost") &&
                      !rawUrl.includes("127.0.0.1") &&
                      !rawUrl.includes("placeholder") &&
                      rawUrl.length > 40; // Real MongoDB Atlas URIs are typically long

if (isDbConnected) {
  prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
}

export { prisma, isDbConnected };

// For server actions — fallback to mock data if DB not connected
export async function withFallback<T>(
  dbFn: () => Promise<T>,
  fallbackFn: () => T
): Promise<T> {
  if (!isDbConnected || !prisma) {
    return fallbackFn();
  }
  try {
    return await dbFn();
  } catch (err) {
    console.warn("[Prisma] DB unavailable, using fallback:", err);
    return fallbackFn();
  }
}
