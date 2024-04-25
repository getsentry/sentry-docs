import {Button} from '@radix-ui/themes';

export type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
export function NavLink({children, ...props}: NavLinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      color="gray"
      size="3"
      radius="medium"
      className="font-medium text-darkPurple py-2 px-3 uppercase"
    >
      <a {...props}>{children}</a>
    </Button>
  );
}
