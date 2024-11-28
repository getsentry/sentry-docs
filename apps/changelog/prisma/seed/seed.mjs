import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create changelogs
    const changelog1 = await prisma.changelog.create({
      data: {
        id: '1',
        createdAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
        title: 'Changelog 1',
        slug: 'changelog-1',
        content: 'Changelog 1 content',
        summary: 'Changelog 1 summary',
        published: true,
        deleted: false,
      },
    });

    const changelog2 = await prisma.changelog.create({
      data: {
        id: '2',
        createdAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
        title: 'Changelog 2',
        slug: 'changelog-2',
        content: 'Changelog 2 content',
        summary: 'Changelog 2 summary',
        published: true,
        deleted: false,
      },
    });

    const changelog3 = await prisma.changelog.create({
      data: {
        id: '3',
        createdAt: new Date('01/01/2020'),
        publishedAt: new Date('01/01/2020'),
        updatedAt: new Date('01/01/2020'),
        title: 'Changelog 3',
        slug: 'changelog-3',
        content: 'Changelog 3 content with [markdown content](https://de.wikipedia.org/wiki/Markdown)',
        summary: 'Changelog 3 summary with [markdown content](https://de.wikipedia.org/wiki/Markdown)',
        published: true,
        deleted: false,
      },
    });

    // Create categories
    await prisma.category.create({
      data: {
        id: '1',
        name: 'Category 1',
        deleted: false,
        changelogs: {
          connect: [{id: changelog1.id}],
        },
      },
    });

    await prisma.category.create({
      data: {
        id: '2',
        name: 'Category 2',
        deleted: false,
        changelogs: {
          connect: [{id: changelog2.id}, {id: changelog3.id}],
        },
      },
    });

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
