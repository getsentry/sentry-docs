import './globals.css';
import 'prism-sentry/index.css';

export default function ChangelogLayout({children}: {children: React.ReactNode}) {
  return <div className="bg-gray-100">{children}</div>;
}
