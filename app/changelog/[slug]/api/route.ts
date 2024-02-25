import {type Category, type Changelog} from '@prisma/client';
import {GET as sessionHandler} from 'app/changelog/api/auth/[...nextauth]/route';
import {NextRequest} from 'next/server';
import {getServerSession} from 'next-auth/next';

import prisma from 'sentry-docs/prisma';

type ChangelogWithCategories = Changelog & {
  categories: Category[];
};

export async function GET(_request: NextRequest, {params}: {params: {slug: string}}) {
  let changelog: ChangelogWithCategories | null = null;
  const session = await getServerSession(sessionHandler);
  let published: boolean | undefined = undefined;
  if (!session) {
    published = true;
  }
  try {
    changelog = await prisma.changelog.findUnique({
      where: {
        slug: params.slug,
        published,
      },
      include: {
        categories: true,
      },
    });
    return Response.json(changelog);
  } catch (e) {
    return Response.error();
  }
}
