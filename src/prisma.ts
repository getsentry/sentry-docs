// using the code from https://github.com/vercel/examples/blob/main/storage/postgres-prisma/lib/prisma.ts
// eventho it's basically the same as it was before
import {PrismaClient} from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
