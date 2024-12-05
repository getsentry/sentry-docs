import {ReactNode} from 'react';
import {DateComponent} from './date';
import {CategoryTag} from './tag';

type ArticleProps = {
  children?: ReactNode;
  className?: string;
  date?: string | Date | null;
  image?: string | null;
  loading?: boolean;
  slug?: string;
  tags?: string[];
  title?: string;
};

export function Article({
  title = '',
  image,
  tags = [],
  date = null,
  children,
  className,
}: ArticleProps) {
  return (
    <article className={`bg-white rounded-lg shadow-lg mb-8 ${className}`}>
      {/* this needs to be a plain <img> next/image doesn't work here because of redirects we do */}
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="object-cover relative w-full h-64 rounded-lg rounded-b-none"
          src={image}
          alt={title}
        />
      )}
      <div className="p-6">
        <h3 className="text-3xl text-primary font-semibold mb-2">{title}</h3>
        <div>
          <div className="flex flex-wrap gap-1 py-1">
            {Array.isArray(tags) && tags.map(tag => <CategoryTag key={tag} text={tag} />)}
          </div>
          <div className="prose max-w-none text-gray-700 py-2">{children}</div>
          <dl>
            <dd className="text-xs leading-6 text-gray-400">
              {date && <DateComponent date={date} />}
            </dd>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function LoadingArticle() {
  return (
    <article className="bg-white rounded-lg shadow-lg mb-8">
      <div className="p-6">
        <div className="h-6 bg-gray-200 mb-2 animate-pulse rounded" />
        <div className="flex flex-wrap gap-1 py-1">
          <div className="h-4 bg-gray-200 w-20 animate-pulse rounded" />
        </div>
        <div className="prose max-w-none text-gray-700 py-2">
          <div className="h-4 bg-gray-200 mb-2" />
          <div className="h-4 bg-gray-200 mb-2 animate-pulse rounded" />
          <div className="h-4 bg-gray-200" />
        </div>
        <div className="text-xs leading-6 text-gray-400 animate-pulse rounded">
          <div className="h-4 bg-gray-200 w-16 animate-pulse rounded" />
        </div>
      </div>
    </article>
  );
}
