import {prisma} from 'sentry-docs/prisma';

const CACHE: Record<string, any> = {};
const ENTRIES_PER_PAGE = 10;

export function getParams(searchParams: ChangelogSearchParams) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const selectedCategories = searchParams?.tags?.split(',') || [];
  const before = searchParams?.before || '';

  const filtered = query || selectedCategories.length || before;
  const serialized = new URLSearchParams(searchParams).toString();
  return {query, currentPage, selectedCategories, before, filtered, serialized};
}

export type ChangelogSearchParams = {
  before?: string;
  page?: string;
  query?: string;
  tags?: string;
};

export async function queryData(changelogSearchParams: ChangelogSearchParams) {
  const {query, currentPage, selectedCategories, before, serialized} =
    getParams(changelogSearchParams);

  if (CACHE[serialized]) {
    return CACHE[serialized];
  }

  const categoryOR: any = [];
  if (selectedCategories.length) {
    categoryOR.push({
      name: {
        in: selectedCategories,
      },
    });
  }
  if (query) {
    categoryOR.push({
      name: {
        contains: query,
      },
    });
  }

  const matchingCategories = await prisma.category.findMany({
    where: {
      OR: categoryOR,
    },
  });
  const matchingCategoryIds = matchingCategories.map(category => category.id);

  const changelogOR: any = [];
  if (selectedCategories.length) {
    changelogOR.push({categories: {some: {id: {in: matchingCategoryIds}}}});
  }
  if (query) {
    changelogOR.push({title: {contains: query}});
    changelogOR.push({summary: {contains: query}});
    changelogOR.push({content: {contains: query}});
  }

  const where: any = {
    published: true,
  };
  if (before) {
    const date = new Date(Date.parse(`${before}`));
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    where.publishedAt = {
      lte: date,
    };
  }
  if (changelogOR.length) {
    where.OR = changelogOR;
  }

  const totalCount = await prisma.changelog.count({where});
  const changelogs = await prisma.changelog.findMany({
    include: {
      categories: true,
    },
    where,
    orderBy: {
      publishedAt: 'desc',
    },
    skip: (currentPage - 1) * ENTRIES_PER_PAGE,
    take: 10,
  });

  const reduceMoths = (changelog: any) => {
    return changelog.reduce((allMonths: any, post: any) => {
      const date = post.publishedAt as Date;
      const year = date.getFullYear();
      const month = date.toLocaleString('default', {
        month: 'long',
      });
      const monthYear = `${month} ${year}`;
      return [...new Set([...allMonths, monthYear])];
    }, []);
  };

  // iterate over all posts and create a list of months & years
  // const months = reduceMoths(changelogs);

  const allMonths = reduceMoths(
    await prisma.changelog.findMany({
      select: {publishedAt: true},
      orderBy: {
        publishedAt: 'desc',
      },
    })
  );

  const pagination = {
    currentPage,
    totalPages: totalCount / ENTRIES_PER_PAGE,
  };

  CACHE[serialized] = {changelogs, allMonths, pagination};
  return CACHE[serialized];
}
