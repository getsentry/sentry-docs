'use client';

import {type Category} from '@prisma/client';
import {ReadonlyURLSearchParams, usePathname, useSearchParams} from 'next/navigation';

import Tag from './tag';

export default function Tags({categories}: {categories: Category[]}) {
  const pathname = usePathname();
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;

  const params = new URLSearchParams(searchParams);
  const selectedCategories = params.get('tags')?.split(',') || [];

  const createPageURL = (category: string) => {
    let newTags = [...selectedCategories];

    if (selectedCategories.includes(category)) {
      newTags = selectedCategories.filter(t => t !== category);
    } else {
      newTags = [...selectedCategories, category];
    }
    params.set('page', '1');
    params.set('tags', newTags.join(','));

    if (newTags.length === 0) {
      params.delete('tags');
    }

    return `${pathname}?${params.toString()}`;
  };

  return categories.map(category => {
    return (
      <a href={createPageURL(category.name)} key={category.id}>
        <Tag
          text={category.name}
          active={selectedCategories.includes(category.name)}
          pointer
        />
      </a>
    );
  });
}
