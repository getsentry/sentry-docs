'use client';

import {ChevronDownIcon} from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useRef, useState} from 'react';

import styles from './style.module.scss';

export type BreadcrumbChildItem = {
  title: string;
  to: string;
};

export type BreadcrumbItem = {
  title: string;
  to: string;
  children?: BreadcrumbChildItem[];
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

function BreadcrumbDropdown({children}: {children: BreadcrumbChildItem[]}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          className={styles['dropdown-trigger']}
          aria-label="Show child pages"
        >
          <ChevronDownIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles['dropdown-content']}
          sideOffset={4}
          align="start"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <ul className={styles['dropdown-list']}>
            {children.map(child => (
              <li key={child.to} className={styles['dropdown-item']}>
                <Link href={child.to} onClick={() => setOpen(false)}>
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

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
    <ul className="not-prose list-none flex flex-wrap items-center" style={{margin: 0}}>
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
            {b.children && <BreadcrumbDropdown>{b.children}</BreadcrumbDropdown>}
          </li>
        );
      })}
    </ul>
  );
}
