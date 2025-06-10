'use client';
import {TriangleRightIcon} from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import {Box, Button, Theme} from '@radix-ui/themes';
import Link from 'next/link';

import {Search} from 'sentry-docs/components/search';

import styles from './styles.module.scss';

type Props = {
  pathname: string;
  searchPlatforms: string[];
};

export function MobileMenu({pathname, searchPlatforms}: Props) {
  const mainSections = [
    {label: 'Products', href: '/product/sentry'},
    {label: 'SDKs', href: '/platforms/'},
    {label: 'Concepts & Reference', href: '/concepts/'},
    {label: 'Admin', href: '/organization/'},
    {label: 'API', href: '/api/'},
    {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
  ];

  return (
    <div className="flex gap-6 items-center">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            size="4"
            color="gray"
            radius="medium"
            className="font-medium text-[var(--foreground)]"
          >
            Menu
            <TriangleRightIcon />
          </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Theme accentColor="iris">
            <Popover.Content className={styles.PopoverContent} sideOffset={5}>
              <Box display={{xs: 'block', sm: 'none'}}>
                <li className={styles.MenuItem}>
                  <Search path={pathname} searchPlatforms={searchPlatforms} />
                </li>
                <div className={styles.MenuSeparator} />
              </Box>
              {mainSections.map(section => (
                <li key={section.href} className={styles.MenuItem}>
                  <Link href={section.href}>{section.label}</Link>
                </li>
              ))}
              <li className={styles.MenuItem}>
                <Link href="https://sentry.io/changelog/">Changelog</Link>
              </li>
              <li className={styles.MenuItem}>
                <Link href="https://sandbox.sentry.io/">Sandbox</Link>
              </li>
              <li className={styles.MenuItem}>
                <Link href="https://sentry.io/">Go to Sentry</Link>
              </li>
              <li className={styles.MenuItem}>
                <Link href="https://sentry.io/signup/">Get Started</Link>
              </li>
            </Popover.Content>
          </Theme>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
