import {PrismaClient} from '@prisma/client';

// This code exists to create a singleton of the prisma client. Prisma clients will always spawn new connections to the
// database so if we don't have it as a singleton, the database might run out of connections.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prismaClient;
}

export {prismaClient};
