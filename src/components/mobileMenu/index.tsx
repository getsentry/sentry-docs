import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {TriangleRightIcon} from '@radix-ui/react-icons';
import {Button} from '@radix-ui/themes';
import Link from 'next/link';

import styles from './styles.module.scss';

export function MobileMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="3"
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
