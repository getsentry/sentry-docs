'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

import {prisma} from '../prisma';

export async function createUser(formData: FormData) {
  const data = {
    passwordHash: formData.get('passwordHash') as string,
    externalId: formData.get('externalId') as string,
    picture: formData.get('picture') as string,
    email: formData.get('email') as string,
    name: formData.get('name') as string,
    changelogs:
      formData.get('changelogs') != ''
        ? {
            connect: formData
              .getAll('changelogs')
              .map(changelogId => ({id: changelogId as string})),
          }
        : {},
    canPostRestricted: formData.get('canPostRestricted') === 'on',
    admin: formData.get('admin') === 'on',
  };

  const user = await prisma.user.create({data});

  if (user) {
    redirect(`/users/${user.id}`);
  }
}

export async function editUser(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    const data = {
      passwordHash: formData.get('passwordHash') as string,
      externalId: formData.get('externalId') as string,
      picture: formData.get('picture') as string,
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      changelogs:
        formData.get('changelogs') !== ''
          ? {
              connect: formData
                .getAll('changelogs')
                .map(changelogId => ({id: changelogId as string})),
            }
          : {deleteMany: {}},
      canPostRestricted: formData.get('canPostRestricted') === 'on',
      admin: formData.get('admin') === 'on',
    };

    await prisma.user.update({
      where: {id},
      data,
    });
  } catch (error) {
    console.error('[EDIT ACTION ERROR:', error);
    return {message: error};
  }

  redirect(`/users/${id}`);
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.user.delete({
      where: {id},
    });
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to delete user'};
  }

  revalidatePath(`/users`);
}
