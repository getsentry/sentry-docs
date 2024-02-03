import {getAllFilesFrontMatter, getFileBySlug} from 'sentry-docs/mdx';
import {prisma} from 'sentry-docs/prisma';

async function main() {
  const posts = await getAllFilesFrontMatter('changelog');

  console.log(posts.length);
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const categoriesArray: {create: {name: string}; where: {name: string}}[] = [];
    let categories = undefined;

    if (Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        categoriesArray.push({
          where: {name: tag.toUpperCase()},
          create: {name: tag.toUpperCase()},
        });
      }
      if (categoriesArray.length > 0) {
        // @ts-ignore
        categories = {
          connectOrCreate: categoriesArray,
        };
      }
    }

    const mdx = await getFileBySlug(`changelog/${post.slug}`);

    try {
      await prisma.changelog.create({
        data: {
          publishedAt: new Date(post.date).toISOString(),
          createdAt: new Date(post.date).toISOString(),
          title: post.title,
          summary: post.summary,
          image: post.image,
          slug: post.slug,
          content: mdx.mdxSource,
          published: true,
          deleted: false,
          categories,
        },
      });
    } catch (error) {
      console.log(categories);
      console.log(error);
    }
  }
}

export default function Seed() {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async e => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return <div>Seeded</div>;
}
