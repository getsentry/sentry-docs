// using the code from https://github.com/vercel/examples/blob/main/storage/postgres-prisma/lib/prisma.ts
// eventho it's basically the same as it was before
import {PrismaClient} from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

// Check and log the presence of DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set.');
} else {
  console.log('DATABASE_URL environment variable is set.');
}

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
