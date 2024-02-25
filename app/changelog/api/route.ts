import prisma from 'sentry-docs/prisma';

export async function GET() {
  const changelogs = await prisma.changelog.findMany({
    include: {
      categories: true,
    },
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
  return Response.json(changelogs);
}
