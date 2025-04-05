'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {redirect} from 'next/navigation';
import {getServerSession} from 'next-auth/next';
import {prismaClient} from '../prisma-client';
import {authOptions} from '../authOptions';
import {ServerActionPayloadInterface} from './serverActionPayload.interface';

const unauthorizedPayload: ServerActionPayloadInterface = {
  success: false,
  message: 'Unauthorized',
};

export async function unpublishChangelog(
  _currentState: ServerActionPayloadInterface,
  formData: FormData
): Promise<ServerActionPayloadInterface> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthorizedPayload;
  }
  const id = formData.get('id') as string;

  try {
    await prismaClient.changelog.update({
      where: {id},
      data: {published: false, publishedAt: null},
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to unpublish changelog', success: false};
  }

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  revalidatePath(`/changelog/_admin`);
  return {success: true};
}

export async function publishChangelog(
  _currentState: ServerActionPayloadInterface,
  formData: FormData
): Promise<ServerActionPayloadInterface> {
  const session = await getServerSession();

  if (!session) {
    return unauthorizedPayload;
  }
  const id = formData.get('id') as string;

  try {
    await prismaClient.changelog.update({
      where: {id},
      data: {published: true, publishedAt: new Date().toISOString()},
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to publish changelog', success: false};
  }

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  revalidatePath(`/changelog/_admin`);
  return {success: true};
}

export async function createChangelog(
  _currentState: ServerActionPayloadInterface,
  formData: FormData
): Promise<ServerActionPayloadInterface> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return unauthorizedPayload;
  }
  const categories = formData.getAll('categories');
  await prismaClient.category.createMany({
    data: categories.map(category => ({name: category as string})),
    skipDuplicates: true,
  });
  const connect = categories.map(category => {
    return {name: category as string};
  });

  if (session.user?.email == null) {
    throw new Error('Invariant: Users must have emails');
  }

  const user = await prismaClient.user.findUnique({
    where: {email: session.user.email},
  });

  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    summary: formData.get('summary') as string,
    image: formData.get('image') as string,
    slug: formData.get('slug') as string,
    author: user ? {connect: {id: user.id}} : undefined,
    categories: formData.get('categories') !== '' ? {connect} : {},
  };

  await prismaClient.changelog.create({data});

  return redirect(`/changelog/_admin`);
}

export async function editChangelog(
  _currentState: ServerActionPayloadInterface,
  formData: FormData
): Promise<ServerActionPayloadInterface> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return unauthorizedPayload;
  }
  const id = formData.get('id') as string;
  const categories = formData.getAll('categories');
  await prismaClient.category.createMany({
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

    await prismaClient.changelog.update({
      where: {id},
      data,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('EDIT ACTION ERROR:', error);
    return {message: (error as Error).message, success: false};
  }

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  return redirect(`/changelog/_admin`);
}

export async function deleteChangelog(
  _currentState: ServerActionPayloadInterface,
  formData: FormData
): Promise<ServerActionPayloadInterface> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return unauthorizedPayload;
  }
  const id = formData.get('id') as string;
  try {
    await prismaClient.changelog.delete({
      where: {id},
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to delete changelog', success: false};
  }

  revalidateTag('changelogs');
  revalidateTag('changelog-detail');
  revalidatePath(`/changelog/_admin`);
  return {
    success: true,
  };
}
