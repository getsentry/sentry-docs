'use client';

import Link from 'next/link';

import {DocNode} from 'sentry-docs/docTree';

import styles from './style.module.scss';

type BreadcrumbsProps = {
  leafNode: DocNode;
};

const PLATFORM_STORAGE_KEY = 'sentry-docs:defined-platform';

export function Breadcrumbs({leafNode}: BreadcrumbsProps) {
  const breadcrumbs: {title: string; to: string}[] = [];

  for (let node: DocNode | undefined = leafNode; node; node = node.parent) {
    if (node && !node.missing) {
      const to = node.path === '/' ? node.path : `/${node.path}/`;
      const title = node.frontmatter.sidebar_title ?? node.frontmatter.title;

      breadcrumbs.unshift({
        to,
        title,
      });
    }
  }

  const handlePlatformsClick = () => {
    // Clear stored platform so SDK selector resets
    localStorage.removeItem(PLATFORM_STORAGE_KEY);
  };

  return (
    <ul className="not-prose list-none flex flex-wrap" style={{margin: 0}}>
      {breadcrumbs.map(b => {
        const isPlatformsLink = b.to === '/platforms/';
        return (
          <li className={styles['breadcrumb-item']} key={b.to}>
            <Link
              href={b.to}
              onClick={isPlatformsLink ? handlePlatformsClick : undefined}
            >
              {b.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
