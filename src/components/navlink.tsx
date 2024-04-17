import {HTMLAttributeAnchorTarget} from 'react';
import {Button} from '@radix-ui/themes';
import Link, {type LinkProps} from 'next/link';

export type NavLinkProps = React.PropsWithChildren<LinkProps> & {
  target?: HTMLAttributeAnchorTarget;
};

export function NavLink({children, ...props}: NavLinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      color="gray"
      size="3"
      radius="medium"
      className="font-medium text-darkPurple py-2 px-3"
    >
      <Link {...props}>{children}</Link>
    </Button>
  );
}
