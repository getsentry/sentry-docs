'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {TriangleRightIcon} from '@radix-ui/react-icons';
import {Box, Button, Theme} from '@radix-ui/themes';
import Link from 'next/link';

import {Search} from 'sentry-docs/components/search';

import styles from './styles.module.scss';

import {ThemeToggle} from '../theme-toggle';

type Props = {
  pathname: string;
  searchPlatforms: string[];
};

export function MobileMenu({pathname, searchPlatforms}: Props) {
  return (
    <div className="flex gap-6 items-center">
      <ThemeToggle />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
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
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <Theme accentColor="iris">
            <DropdownMenu.Content className={styles.DropdownMenuContent} sideOffset={5}>
              <Box display={{xs: 'block', sm: 'none'}}>
                <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
                  <Search path={pathname} searchPlatforms={searchPlatforms} />
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={styles.DropdownMenuSeparator} />
              </Box>
              <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
                <Link href="https://sentry.io/changelog/">Changelog</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
                <Link href="https://try.sentry-demo.com/demo/start/">Sandbox</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
                <Link href="https://sentry.io/">Go to Sentry</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
                <Link href="https://sentry.io/signup/">Get Started</Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </Theme>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
