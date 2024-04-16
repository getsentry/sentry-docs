'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {TriangleRightIcon} from '@radix-ui/react-icons';
import {Box, Button} from '@radix-ui/themes';
import Link from 'next/link';

import {Search} from 'sentry-docs/components/search';

import styles from './styles.module.scss';

type Props = {
  pathname: string;
  searchPlatforms: string[];
};

export function MobileMenu({pathname, searchPlatforms}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="4"
          color="gray"
          radius="medium"
          className="font-medium text-darkPurple"
        >
          Menu
          <TriangleRightIcon />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.DropdownMenuContent} sideOffset={5}>
          <Box display={{xs: 'block', sm: 'none'}}>
            <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
              <Search path={pathname} searchPlatforms={searchPlatforms} />
            </DropdownMenu.Item>

            <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
              <Link
                href="https://docsbot.ai/chat/skFEy0qDC01GrRrZ7Crs/EPqsd8nu2XmKzWnd45tL"
                target="_blank"
                className="mt-2 md:hidden"
              >
                Ask A Bot
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={styles.DropdownMenuSeparator} />
          </Box>

          <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
            <Link href="/product/">API</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
            <Link href="/changelog">Changelog</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
            <Link href="https://try.sentry-demo.com/demo/start/">Sandbox</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={styles.DropdownMenuItem} asChild>
            <Link href="https://sentry.io/">Sign In</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
