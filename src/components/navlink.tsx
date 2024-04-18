import {Button} from '@radix-ui/themes';
import Link, {LinkProps as NextLinkProps} from 'next/link';

export type NavLinkProps = React.PropsWithChildren<Omit<NextLinkProps, 'passHref'>> & {
  className?: string;
  style?: React.CSSProperties;
  target?: string;
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
