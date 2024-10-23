import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';

import {PaginationNavNode} from 'sentry-docs/types/paginationNavNode';

export function PaginationNav({
  node,
  title,
}: {
  node: PaginationNavNode;
  title: 'Previous' | 'Next';
}) {
  return (
    <a href={`/${node.path}`} className="no-underline group">
      <div
        className={`py-3 px-4 border-2 rounded-md transition-colors hover:[border-color:var(--accent)] ${
          title === 'Previous' ? 'text-left' : 'text-right'
        }`}
      >
        <div className="text-sm [color:var(--foreground)]">{title}</div>
        <div
          className={`flex items-center gap-1 font-[500] ${
            title === 'Previous' ? 'justify-start' : 'justify-end'
          }`}
        >
          {title === 'Previous' && (
            <div className="transition-transform group-hover:-translate-x-1">
              <DoubleArrowLeftIcon />
            </div>
          )}

          {node.title}

          {title === 'Next' && (
            <div className="transition-transform group-hover:translate-x-1">
              <DoubleArrowRightIcon />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
