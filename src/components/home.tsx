import Link from 'next/link';
import {Banner} from 'sentry-docs/components/banner';
import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';

import AskAiSearchParams from './askAiSearchParams';
import {Header} from './header';
import {HomeSearchObserver} from './homeSearchVisibility';
import {NavLink, NavLinkProps} from './navlink';
import {PlatformIcon} from './platformIcon';
import {Search} from './search';
import {SentryWordmarkLogo} from './wordmarkLogo';

export async function Home() {
  const rootNode = await getDocsRootNode();
  const platforms = extractPlatforms(rootNode);
  const mostViewedSDKs = [
    {
      key: 'javascript-nextjs',
      title: 'Next.js',
      url: '/platforms/javascript/guides/nextjs/',
    },
    {key: 'javascript-node', title: 'Node.js', url: '/platforms/javascript/guides/node/'},
    {key: 'javascript-react', title: 'React', url: '/platforms/javascript/guides/react/'},
    {key: 'react-native', title: 'React Native', url: '/platforms/react-native/'},
    {key: 'python', title: 'Python', url: '/platforms/python/'},
    {key: 'php-laravel', title: 'Laravel', url: '/platforms/php/guides/laravel/'},
    {key: 'apple', title: 'Apple', url: '/platforms/apple/'},
    {key: 'android', title: 'Android', url: '/platforms/android/'},
    {key: 'go', title: 'Go', url: '/platforms/go/'},
    {key: 'dotnet', title: '.NET', url: '/platforms/dotnet/'},
    {key: 'java', title: 'Java', url: '/platforms/java/'},
    {key: 'ruby', title: 'Ruby', url: '/platforms/ruby/'},
  ];

  return (
    <div className="tw-app">
      <Header
        pathname="/"
        searchPlatforms={[]}
        useStoredSearchPlatforms={false}
        platforms={platforms}
      />
      <main id="main">
        <div className="mt-[var(--header-height)]">
          <Banner />
        </div>

        {/* Hero */}
        <section className="w-full relative hero-gradient">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8 pt-16 pb-10 text-center relative z-10">
            <h1
              className="font-bold text-[var(--gray-12)] dark:text-white mb-4"
              style={{fontSize: '40px', lineHeight: 1.15, letterSpacing: '-0.02em'}}
            >
              Get started with Sentry
            </h1>
            <p
              className="text-[var(--gray-11)] dark:text-[var(--gray-11)] max-w-xl mx-auto mb-8"
              style={{fontSize: '17px', lineHeight: 1.5}}
            >
              Sentry provides end-to-end distributed tracing, enabling developers to
              identify and debug performance issues and errors across their systems and
              services.
            </p>
            <HomeSearchObserver>
              <div className="home-search-bar relative z-50 max-w-xl mx-auto">
                <Search path="/" searchPlatforms={[]} useStoredSearchPlatforms={false} />
              </div>
            </HomeSearchObserver>
          </div>
        </section>

        {/* Bifurcated setup paths */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 -mt-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI setup */}
            <Link href="/ai/agent-plugin/" className="setup-card group no-underline">
              <div className="setup-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.9 4.6L18.5 8.5 13.9 10.4 12 15l-1.9-4.6L5.5 8.5l4.6-1.9L12 2z" />
                  <path d="M18.5 13.5l.95 2.3 2.3.95-2.3.95-.95 2.3-.95-2.3-2.3-.95 2.3-.95.95-2.3z" />
                </svg>
              </div>
              <h2 className="setup-title">Set up with AI</h2>
              <p className="setup-desc">
                Let your AI coding assistant install and configure Sentry for you, using
                Sentry&apos;s agent skills, editor rules, and MCP server.
              </p>
              <span className="setup-cta">
                Start AI setup
                <Arrow />
              </span>
            </Link>

            {/* Manual setup — plain <a> so the same-page hash reliably scrolls (next/link doesn't) */}
            <a href="#platforms" className="setup-card group no-underline">
              <div className="setup-icon">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
                  <path d="M6.5 9l3 3-3 3" />
                  <path d="M12.5 15h5" />
                </svg>
              </div>
              <h2 className="setup-title">Set up manually</h2>
              <p className="setup-desc">
                Choose your platform and follow a step-by-step guide to install the SDK
                and send your first event.
              </p>
              <span className="setup-cta">
                Choose your platform
                <Arrow />
              </span>
            </a>
          </div>
        </section>

        {/* Popular SDKs */}
        <section
          id="platforms"
          className="max-w-screen-lg mx-auto px-4 sm:px-8 pt-10 pb-6 scroll-mt-[var(--header-height)]"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--gray-12)]">Popular SDKs</h3>
            <Link href="/platforms/" className="text-sm font-medium accent-link">
              View all SDKs
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {mostViewedSDKs.map(platform => (
              <Link
                key={platform.key}
                href={platform.url}
                className="sdk-tile flex flex-col items-center justify-center gap-2 bg-white dark:bg-[var(--gray-2)] no-underline py-4 rounded-lg"
              >
                <PlatformIcon
                  platform={platform.key}
                  size={38}
                  format="lg"
                  style={{margin: 0, display: 'block'}}
                />
                <span
                  className="text-[var(--gray-12)] whitespace-nowrap"
                  style={{fontSize: '0.72rem', fontWeight: 500}}
                >
                  {platform.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Secondary quick links */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 pt-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <QuickLink
              href="/product/"
              title="What is Sentry?"
              desc="Error monitoring, tracing, and more."
            />
            <QuickLink
              href="/product/ai-in-sentry/seer/"
              title="Fix faster with Seer"
              desc="AI debugging, root cause, and autofix."
            />
            <QuickLink
              href="/pricing/"
              title="Pricing & Billing"
              desc="How our pricing and quotas work."
            />
            <QuickLink
              href="/api/"
              title="API"
              desc="Access Sentry programmatically."
            />
            <QuickLink
              href="/cli/"
              title="CLI"
              desc="Use sentry-cli on the command line."
            />
          </div>
        </section>
      <footer className="mt-12 pb-10 w-full z-50 max-w-7xl mx-auto md:px-6 space-y-4 px-6 lg:px-8">
        <div className="px-3 pt-10 border-t border-gray">
          <div className="flex flex-col items-start md:flex-row md:flex-wrap md:gap-x-6 gap-y-2 mb-2">
            <FooterLink href="/security-legal-pii/">Security, Legal & PII</FooterLink>
            <FooterLink href="/contributing">Contribute</FooterLink>
            <FooterLink href="https://www.sentry.help/en/" external>
              Support
            </FooterLink>
            <FooterLink href="https://sentry.io/changelog/" external>
              Changelog
            </FooterLink>
          </div>
          <div className="flex flex-col items-start md:flex-row md:flex-wrap md:gap-x-6 gap-y-2">
            <FooterLink href="https://sandbox.sentry.io/" external>
              Sandbox
            </FooterLink>
            <FooterLink href="https://develop.sentry.dev/self-hosted/" external>
              Self-hosting Sentry
            </FooterLink>
            <FooterLink href="https://develop.sentry.dev/" external>
              Developer docs
            </FooterLink>
          </div>
        </div>
        <p className="px-3 text-sm">
          © {new Date().getFullYear()} • Sentry is a registered trademark of Functional
          Software, Inc.
        </p>
        <div className="bg-accent-purple max-w-max md:ml-auto ml-2 px-5">
          <SentryWordmarkLogo height={50} fill="#ffffff" />
        </div>
      </footer>
      </main>
      <AskAiSearchParams />
      <style>{`
        .hero-gradient {
          background: linear-gradient(to bottom, rgba(168, 139, 250, 0.15) 0%, rgba(255, 255, 255, 0) 100%), #ffffff;
        }
        .dark .hero-gradient {
          background: linear-gradient(to bottom, rgba(168, 139, 250, 0.15) 0%, rgba(0, 0, 0, 0) 100%), var(--gray-1);
        }
        .accent-link { color: #6c5fc7; }
        .accent-link:hover { text-decoration: underline; }
        /* Setup path cards */
        .setup-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid var(--gray-4);
          border-radius: 16px;
          padding: 28px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .dark .setup-card { background: var(--gray-2); border-color: var(--gray-4); }
        .setup-card:hover {
          transform: translateY(-3px);
          border-color: #a78bfa;
          box-shadow: 0 10px 30px rgba(108, 95, 199, 0.15);
        }
        .setup-icon {
          width: 48px; height: 48px;
          display: grid; place-items: center;
          border-radius: 12px;
          color: #6c5fc7;
          background: rgba(108, 95, 199, 0.12);
          margin-bottom: 16px;
        }
        .setup-title {
          font-size: 20px; font-weight: 600; margin: 0 0 8px;
          color: var(--gray-12);
        }
        .setup-desc {
          font-size: 14.5px; line-height: 1.55; margin: 0 0 20px;
          color: var(--gray-11); flex: 1;
        }
        .setup-cta {
          display: inline-flex; align-items: center; gap: 6px;
          font-weight: 600; font-size: 14.5px; color: #6c5fc7;
        }
        .setup-card:hover .setup-cta svg { transform: translateX(3px); }
        .setup-cta svg { transition: transform 0.15s ease; }
        .sdk-tile {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .sdk-tile:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.10); }
        .dark .sdk-tile { border: 1px solid var(--gray-4); }
        .quick-link {
          display: block; padding: 18px 20px; border-radius: 12px;
          border: 1px solid var(--gray-4); background: #fff;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .dark .quick-link { background: var(--gray-2); }
        .quick-link:hover { border-color: #a78bfa; transform: translateY(-2px); }
        .home-search-bar input[type="text"], .home-search-bar input {
          height: 48px !important;
          font-size: 1rem !important;
          width: 100% !important;
          background: #fff;
          border: 1.5px solid #a78bfa !important;
          box-shadow: 0 2px 12px 0 rgba(168,139,250,0.10);
          border-radius: 12px !important;
          color: #1a1a1a;
        }
        .dark .home-search-bar input[type="text"], .dark .home-search-bar input {
          background: var(--gray-2) !important;
          color: #f3f3f3 !important;
        }
      `}</style>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function QuickLink({href, title, desc}: {desc: string; href: string; title: string}) {
  return (
    <Link href={href} className="quick-link no-underline">
      <div className="font-semibold text-[var(--gray-12)] mb-1">{title}</div>
      <div className="text-sm text-[var(--gray-11)] leading-snug">{desc}</div>
    </Link>
  );
}

function FooterLink({
  children,
  external,
  ...props
}: NavLinkProps & {href: string; external?: boolean}) {
  const target = props.target ?? (props.href?.startsWith('http') ? '_blank' : undefined);

  return (
    <NavLink {...props} target={target}>
      {children}
      {external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          viewBox="0 0 16 16"
          fill="none"
          className="inline-block ml-2 fill-[var(--foreground)]"
        >
          <g>
            <path d="M10 0C9.44687 0 9 0.446875 9 1C9 1.55313 9.44687 2 10 2H12.5844L6.29375 8.29375C5.90312 8.68437 5.90312 9.31875 6.29375 9.70938C6.68437 10.1 7.31875 10.1 7.70937 9.70938L14 3.41563V6C14 6.55312 14.4469 7 15 7C15.5531 7 16 6.55312 16 6V1C16 0.446875 15.5531 0 15 0H10ZM2.5 1C1.11875 1 0 2.11875 0 3.5V13.5C0 14.8813 1.11875 16 2.5 16H12.5C13.8813 16 15 14.8813 15 13.5V10C15 9.44687 14.5531 9 14 9C13.4469 9 13 9.44687 13 10V13.5C13 13.775 12.775 14 12.5 14H2.5C2.225 14 2 13.775 2 13.5V3.5C2 3.225 2.225 3 2.5 3H6C6.55312 3 7 2.55312 7 2C7 1.44687 6.55312 1 6 1H2.5Z" />
          </g>
        </svg>
      )}
    </NavLink>
  );
}
