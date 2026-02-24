'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {DocNode} from 'sentry-docs/docTree';

import styles from './style.module.scss';

type BreadcrumbsProps = {
  leafNode: DocNode;
};

export function Breadcrumbs({leafNode}: BreadcrumbsProps) {
  const router = useRouter();
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

  const handlePlatformsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear stored platform so SDK selector resets
    localStorage.removeItem('active-platform');
    // Navigate after clearing localStorage
    router.push('/platforms/');
  };

  return (
    <ul className="not-prose list-none flex flex-wrap" style={{margin: 0}}>
      {breadcrumbs.map(b => {
        const isPlatformsLink = b.to === '/platforms/';
        return (
          <li className={styles['breadcrumb-item']} key={b.to}>
            {isPlatformsLink ? (
              <a href={b.to} onClick={handlePlatformsClick}>
                {b.title}
              </a>
            ) : (
              <Link href={b.to}>{b.title}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
