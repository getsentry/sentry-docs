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
    <a href={`/${node.path}`} className="no-underline">
      <div
        className={`py-3 px-4 border-2 dark:[border-color:var(--gray-4)]  rounded-md transition-colors hover:[border-color:var(--accent)] ${
          title === 'Previous' ? 'text-left' : 'text-right'
        }`}
      >
        <div className="text-sm [color:var(--foreground)]">{title}</div>
        <div
          className={`flex items-center gap-1 font-[500] ${
            title === 'Previous' ? 'justify-start' : 'justify-end'
          }`}
        >
          {title === 'Previous' && <DoubleArrowLeftIcon />}

          {node.title}

          {title === 'Next' && <DoubleArrowRightIcon />}
        </div>
      </div>
    </a>
  );
}
