'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';

import styles from './style.module.scss';

export type BreadcrumbItem = {
  title: string;
  to: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({items}: BreadcrumbsProps) {
  const router = useRouter();

  const handlePlatformsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear stored platform so SDK selector resets
    localStorage.removeItem('active-platform');
    // Navigate after clearing localStorage
    router.push('/platforms/');
  };

  return (
    <ul className="not-prose list-none flex flex-wrap" style={{margin: 0}}>
      {items.map(b => {
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
