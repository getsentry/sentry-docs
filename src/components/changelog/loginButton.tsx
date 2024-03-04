'use client';

import {LockClosedIcon} from '@radix-ui/react-icons';
import {Avatar, Box, Button, Card, Flex, Link, Text} from '@radix-ui/themes';
import {signIn, signOut, useSession} from 'next-auth/react';

export default function Component({className = ''}) {
  const {data: session} = useSession();
  if (session) {
    return (
      <Card style={{maxWidth: 240}}>
        <Flex gap="3" align="center">
          <Avatar size="3" src={session.user?.image || ''} radius="full" fallback="U" />
          <Box>
            <Text as="div" size="2" weight="bold">
              {session.user?.name}
            </Text>
            <Link className={className} onClick={() => signOut()}>
              Sign Out
            </Link>
          </Box>
        </Flex>
      </Card>
    );
  }
  return (
    <Button className={className} onClick={() => signIn()} size="4">
      <LockClosedIcon width="16" height="16" /> Sign In
    </Button>
  );
}
