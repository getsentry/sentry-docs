'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

import {prisma} from '../prisma';

export async function createChangelog(formData: FormData) {
  const data = {
    publishedAt: new Date(formData.get('publishedAt') as string).toISOString(),
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    published: formData.get('published') === 'on',
    deleted: formData.get('deleted') === 'on',
    author:
      formData.get('author') !== ''
        ? {connect: {id: formData.get('author') as string}}
        : {},
    category:
      formData.get('category') !== ''
        ? {connect: {id: formData.get('category') as string}}
        : {},
  };

  const changelog = await prisma.changelog.create({data});

  if (changelog) {
    redirect(`/changelogs/${changelog.id}`);
  }
}

export async function editChangelog(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    const data = {
      publishedAt: new Date(formData.get('publishedAt') as string).toISOString(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      published: formData.get('published') === 'on',
      deleted: formData.get('deleted') === 'on',
      author:
        formData.get('author') != ''
          ? {connect: {id: formData.get('author') as string}}
          : {disconnect: true},
      category:
        formData.get('category') != ''
          ? {connect: {id: formData.get('category') as string}}
          : {disconnect: true},
    };

    await prisma.changelog.update({
      where: {id},
      data,
    });
  } catch (error) {
    console.error('[EDIT ACTION ERROR:', error);
    return {message: error};
  }

  redirect(`/changelogs/${id}`);
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

  revalidatePath(`/changelogs`);
}
