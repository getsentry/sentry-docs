import 'prism-sentry/index.css';
import 'sentry-docs/styles/screen.scss';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}