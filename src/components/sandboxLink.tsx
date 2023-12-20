import Link from "next/link";

const scenarios = [
  'performance',
  'releases',
  'alerts',
  'discover',
  'dashboards',
  'projects',
  'oneDiscoverQuery',
  'oneIssue',
  'oneBreadcrumb',
  'oneStackTrace',
  'oneTransaction',
  'oneWebVitals',
  'oneTransactionSummary',
  'oneRelease',
] as const;

type Props = {
  children: React.ReactNode;
  errorType?: string;
  platform?: string;
  projectSlug?: string;
  scenario?: (typeof scenarios)[number];
  target?: string;
};

export function SandboxLink({children, platform, target, ...params}: Props) {
  return <Link href="#">{children}</Link>;
}
