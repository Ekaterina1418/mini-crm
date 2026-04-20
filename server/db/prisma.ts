
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

declare global {
  var __prisma__: PrismaClient | undefined;
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL 
});


const prisma = global.__prisma__ ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.__prisma__ = prisma;

export default prisma;
