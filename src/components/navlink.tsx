import {Button} from '@radix-ui/themes';
import Link, {LinkProps as NextLinkProps} from 'next/link';
import {ferryUrlParams} from 'sentry-docs/utils';

export type NavLinkProps = React.PropsWithChildren<Omit<NextLinkProps, 'passHref'>> & {
  className?: string;
  style?: React.CSSProperties;
  target?: string;
};
export function NavLink({children, href, ...props}: NavLinkProps) {
  // Ferry URL parameters for navigation links
  const ferriedHref = href ? ferryUrlParams(href.toString()) : href;

  return (
    <Button
      asChild
      variant="ghost"
      color="gray"
      size="3"
      radius="medium"
      className="font-medium text-[var(--foreground)] py-2 px-3 uppercase"
    >
      <Link href={ferriedHref} {...props}>{children}</Link>
    </Button>
  );
}
