import {AnchorHTMLAttributes} from 'react';
import Link, {type LinkProps} from 'next/link';

type NavLinkProps = LinkProps &
  AnchorHTMLAttributes<any> & {
    children: string;
  };

export function NavLink({children, ...props}: NavLinkProps) {
  return (
    <Link
      {...props}
      className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium text-darkPurple hover:text-darkPurple hover:no-underline uppercase text-nowrap"
    >
      {children}
    </Link>
  );
}
