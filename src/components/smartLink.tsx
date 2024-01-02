import Link from 'next/link';

interface Props {
  activeClassName?: string;
  children?: React.ReactNode;
  className?: string;
  href?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  remote?: boolean;
  target?: string;
  title?: string;
  to?: string;
}

export function SmartLink({
  to,
  href,
  children,
  activeClassName = 'active',
  remote = false,
  className = '',
  isActive,
  ...props
}: Props) {
  return (
    <Link
      href={to || href || ''}
      className={`${isActive ? activeClassName : ''} ${className}`}
      prefetch={false}
      {...props}
    >
      {children || to || href}
    </Link>
  );
}
