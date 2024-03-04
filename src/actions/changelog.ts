'use server';

import {GET as handler} from 'app/api/auth/[...nextauth]/route';
import {revalidatePath, revalidateTag} from 'next/cache';
import {redirect} from 'next/navigation';
import {getServerSession} from 'next-auth/next';

import prisma from '../prisma';

export async function unpublishChangelog(formData: FormData) {
  const session = await getServerSession(handler);
  if (!session) {
    return {message: 'Unauthorized'};
  }
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

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  return revalidatePath(`/changelog/_admin`);
}

export async function publishChangelog(formData: FormData) {
  const session = await getServerSession(handler);
  if (!session) {
    return {message: 'Unauthorized'};
  }
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

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  return revalidatePath(`/changelog/_admin`);
}

export async function createChangelog(formData: FormData) {
  const session = await getServerSession(handler);
  if (!session) {
    return {message: 'Unauthorized'};
  }
  const categories = formData.getAll('categories');
  await prisma.category.createMany({
    data: categories.map(category => ({name: category as string})),
    skipDuplicates: true,
  });
  const connect = categories.map(category => {
    return {name: category as string};
  });
  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: {email: session?.user?.email as string},
  });
  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    summary: formData.get('summary') as string,
    image: formData.get('image') as string,
    slug: formData.get('slug') as string,
    author: {connect: {id: user?.id as string}},
    categories: formData.get('categories') !== '' ? {connect} : {},
  };

  await prisma.changelog.create({data});

  return redirect(`/changelog/_admin`);
}

export async function editChangelog(formData: FormData) {
  const session = await getServerSession(handler);
  if (!session) {
    return {message: 'Unauthorized'};
  }
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
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      image: formData.get('image') as string,
      slug: formData.get('slug') as string,
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

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  return redirect(`/changelog/_admin`);
}

export async function deleteChangelog(formData: FormData) {
  const session = await getServerSession(handler);
  if (!session) {
    return {message: 'Unauthorized'};
  }
  const id = formData.get('id') as string;
  try {
    await prisma.changelog.delete({
      where: {id},
    });
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to delete changelog'};
  }

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  return revalidatePath(`/changelog/_admin`);
}
