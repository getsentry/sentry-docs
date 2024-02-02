'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

import {prisma} from '../prisma';

export async function unpublishChangelog(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.changelog.update({
      where: {id},
      data: {published: false, publishedAt: null},
    });
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to unpublish changelog'};
  }

  revalidatePath(`/changelog/_admin`);
}

export async function publishChangelog(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.changelog.update({
      where: {id},
      data: {published: true, publishedAt: new Date().toISOString()},
    });
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to publish changelog'};
  }

  revalidatePath(`/changelog/_admin`);
}

export async function createChangelog(formData: FormData) {
  // iterate over all cateogires and create them if they don't exist
  const categories = formData.getAll('categories');
  await prisma.category.createMany({
    data: categories.map(category => ({name: category as string})),
    skipDuplicates: true,
  });
  const connect = categories.map(category => {
    return {name: category as string};
  });
  const data = {
    // publishedAt: new Date(formData.get('publishedAt') as string).toISOString(),
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    summary: formData.get('summary') as string,
    slug: formData.get('slug') as string,
    // published: formData.get('published') === 'on',
    // deleted: formData.get('deleted') === 'on',
    // author:
    //   formData.get('author') !== ''
    //     ? {connect: {id: formData.get('author') as string}}
    //     : {},
    categories: formData.get('categories') !== '' ? {connect} : {},
  };

  const changelog = await prisma.changelog.create({data});

  if (changelog) {
    redirect(`/changelog/_admin`);
  }
}

export async function editChangelog(formData: FormData) {
  const id = formData.get('id') as string;
  const categories = formData.getAll('categories');
  await prisma.category.createMany({
    data: categories.map(category => ({name: category as string})),
    skipDuplicates: true,
  });
  const connect = categories.map(category => {
    return {name: category as string};
  });
  try {
    const data = {
      // publishedAt: new Date(formData.get('publishedAt') as string).toISOString(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      slug: formData.get('slug') as string,
      // published: formData.get('published') === 'on',
      // deleted: formData.get('deleted') === 'on',
      // author:
      //   formData.get('author') !== ''
      //     ? {connect: {id: formData.get('author') as string}}
      //     : {},
      categories: formData.get('categories') !== '' ? {set: [...connect]} : {set: []},
    };

    await prisma.changelog.update({
      where: {id},
      data,
    });
  } catch (error) {
    console.error('EDIT ACTION ERROR:', error);
    return {message: error};
  }

  redirect(`/changelog/_admin`);
}

export async function deleteChangelog(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.changelog.delete({
      where: {id},
    });
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to delete changelog'};
  }

  revalidatePath(`/changelog/_admin`);
}
