import {AnchorHTMLAttributes} from 'react';
import {Button} from '@radix-ui/themes';
import Link, {type LinkProps} from 'next/link';

type NavLinkProps = LinkProps &
  AnchorHTMLAttributes<any> & {
    children: React.ReactNode;
  };

export function NavLink({children, ...props}: NavLinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      color="gray"
      size="3"
      radius="medium"
      className="font-medium text-darkPurple"
    >
      <Link {...props}>{children}</Link>
    </Button>
  );
}
