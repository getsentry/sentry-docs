'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

import {prisma} from '../prisma';

export async function createCategory(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    deleted: formData.get('deleted') === 'on',
    changelogs:
      formData.get('changelogs') !== ''
        ? {
            connect: formData
              .getAll('changelogs')
              .map(changelogId => ({id: changelogId as string})),
          }
        : {},
  };

  const category = await prisma.category.create({data});

  if (category) {
    redirect(`/categories/${category.id}`);
  }
}

export async function editCategory(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      deleted: formData.get('deleted') === 'on',
      changelogs:
        formData.get('changelogs') != ''
          ? {
              connect: formData
                .getAll('changelogs')
                .map(changelogId => ({id: changelogId as string})),
            }
          : {deleteMany: {}},
    };

    await prisma.category.update({
      where: {id},
      data,
    });
  } catch (error) {
    console.error('[EDIT ACTION ERROR:', error);
    return {message: error};
  }

  redirect(`/categories/${id}`);
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.category.delete({
      where: {id},
    });
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error);
    return {message: 'Unable to delete category'};
  }

  revalidatePath(`/categories`);
}
