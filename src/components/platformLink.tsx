import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  to?: string;
};

export function PlatformLink({children, to}: Props) {
  if (!to) {
    return children;
  }
  return <Link href={to}>{children}</Link>;
}
