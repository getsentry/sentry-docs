import {ReactNode} from 'react';
import Image from 'next/image';

import Date from './date';
import Tag from './tag';

type ArticleProps = {
  date: string;
  slug: string;
  tags: string[];
  title: string;
  children?: ReactNode;
  className?: string;
  image?: string;
};

export default function Article({
  title,
  image,
  tags,
  date,
  children,
  className,
}: ArticleProps) {
  return (
    <article className={`bg-white rounded-lg shadow-lg mb-8 ${className}`}>
      {image && (
        <div className="relative w-full h-64">
          <Image
            className="object-cover rounded-lg rounded-b-none"
            src={image}
            fill
            alt={title}
            sizes="(max-width: 768px) 100vw"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-3xl text-primary font-semibold mb-2">{title}</h3>
        <div>
          <div className="flex flex-wrap gap-1 py-1">
            {Array.isArray(tags) && tags.map(tag => <Tag key={tag} text={tag} />)}
          </div>

          <div className="prose max-w-none text-gray-700 py-2">{children}</div>
          <dl>
            <dd className="text-xs leading-6 text-gray-400">
              <Date date={date} />
            </dd>
          </dl>
        </div>
      </div>
    </article>
  );
}
