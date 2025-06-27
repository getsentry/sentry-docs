import {Tooltip} from '@radix-ui/themes';

import {Banner} from 'sentry-docs/components/banner';
import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';
import PlugImage from 'sentry-docs/imgs/api.png';
import ChatBubble from 'sentry-docs/imgs/chat-bubble.png';
import TerminalImage from 'sentry-docs/imgs/cli.png';
import ConceptsImage from 'sentry-docs/imgs/concepts-reference.png';
import BgLinkedin from 'sentry-docs/imgs/Linkedin-1128x191.png';
import OrganizationImage from 'sentry-docs/imgs/organization.png';
import CalculatorImage from 'sentry-docs/imgs/pricing.png';
import RocketImage from 'sentry-docs/imgs/rocket.png';
import SecurityImage from 'sentry-docs/imgs/security.png';
import SupportImage from 'sentry-docs/imgs/support.png';
import YellowShape08 from 'sentry-docs/imgs/yellow-shape-08.png';

import AskAiSearchParams from './askAiSearchParams';
import {Card} from './card';
import Header from './header';
import {NavLink, NavLinkProps} from './navlink';
import {PlatformFilter} from './platformFilter';
import {PlatformIcon} from './platformIcon';
import {Search} from './search';
import {SentryWordmarkLogo} from './wordmarkLogo';

export default async function Home() {
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
    {key: 'python', title: 'Python', url: '/platforms/python/'},
    {key: 'php-laravel', title: 'Laravel', url: '/platforms/php/guides/laravel/'},
    {key: 'react-native', title: 'React Native', url: '/platforms/react-native/'},
    {key: 'apple', title: 'Apple', url: '/platforms/apple/'},
    {key: 'android', title: 'Android', url: '/platforms/android/'},
    {key: 'dart', title: 'Dart', url: '/platforms/dart/'},
  ];
  return (
    <div className="tw-app">
      <Header
        pathname="/"
        searchPlatforms={[]}
        useStoredSearchPlatforms={false}
        platforms={platforms}
      />
      <div className="mt-[var(--header-height)]">
        <Banner />
      </div>
      {/* Slanted Banner with Welcome Header and Subheader */}
      <div
        className="flex flex-col items-center justify-center w-full relative"
        style={{
          height: '270px',
          backgroundImage: `url(${BgLinkedin.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          marginBottom: 0,
        }}
      >
        <h1
          className="text-4xl font-bold mb-2 text-center"
          style={{
            color: '#fff',
            textShadow: '0 4px 16px #000, 0 0 8px #000, 0 0 2px #000',
          }}
        >
          Welcome to Sentry Docs
        </h1>
        <p
          className="text-lg font-bold text-center max-w-2xl"
          style={{
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 2px #000',
            letterSpacing: '0.03em',
          }}
        >
          Sentry provides end-to-end distributed tracing, enabling developers to identify
          and debug performance issues and errors across their systems and services.
        </p>
      </div>
      {/* Search + SDKs row, same width as Sentry Products */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 w-full" style={{marginTop: 0, paddingTop: 0}}>
        <div
          className="w-full flex flex-col md:flex-row items-stretch justify-between relative"
          style={{marginTop: 0, marginBottom: 0}}
        >
          {/* Left column: Search Bar, left-aligned */}
          <div className="flex-1 flex flex-col items-start justify-center w-full max-w-full relative">
            <div className="home-search-bar w-full relative">
              <Search path="/" searchPlatforms={[]} useStoredSearchPlatforms={false} />
            </div>
          </div>
          {/* Decorative yellow-shape-08 line between search and SDKs */}
          <img
            src={YellowShape08.src}
            alt="decorative line"
            className="hidden md:block pointer-events-none"
            style={{
              position: 'absolute',
              left: 'calc(20% + 90px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '65%',
              height: '120px',
              zIndex: -1,
              objectFit: 'contain',
            }}
          />
          {/* Right column: Most Viewed SDKs, right-aligned */}
          <div className="flex-1 flex flex-col items-end justify-end w-full self-stretch">
            <div
              className="bg-white dark:bg-[var(--gray-2)] rounded-xl shadow-md dark:shadow-none px-10 py-6 flex flex-col items-start"
              style={{
                width: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 0,
              }}
            >
              <h2 className="text-lg font-semibold mb-1 text-left w-full">
                <span className="dark:text-white">Most Viewed Sentry SDKs</span>
              </h2>
              <p className="text-left text-gray-600 dark:text-[var(--foreground-secondary)] mb-4 w-full">
                Get started by setting up Sentry in your app to capture your first errors
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 70px)',
                  rowGap: '12px',
                  columnGap: '18px',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                {mostViewedSDKs.map(platform => (
                  <Tooltip content={platform.title} key={platform.key}>
                    <a
                      href={platform.url}
                      style={{
                        width: 70,
                        height: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        textDecoration: 'none',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <PlatformIcon
                        platform={platform.key}
                        size={50}
                        format="lg"
                        style={{margin: 0, display: 'block'}}
                      />
                      <span
                        style={{
                          marginTop: 6,
                          fontSize: '0.85rem',
                          color: '#6b7280',
                          textAlign: 'center',
                          width: '100%',
                          fontWeight: 500,
                          letterSpacing: 0.1,
                          lineHeight: 1.1,
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {platform.title}
                      </span>
                    </a>
                  </Tooltip>
                ))}
              </div>
              <a
                href="#all-sdks"
                className="text-accent-purple hover:underline font-medium text-base text-left block mt-2 w-full"
              >
                See all SDKs
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="hero max-w-screen-xl mx-auto px-6 lg:px-8 py-2">
        {/* Sentry Products Header */}
        <h2 className="text-2xl mt-16 mb-6 font-medium">Sentry Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 md:items-start">
          {/* Column 1: Sentry */}
          <div>
            <div className="flex items-center mb-4 gap-2 min-h-[32px]">
              <PlatformIcon platform="sentry" size={24} format="lg" />
              <a
                href="/product/sentry/"
                className="text-xl font-medium text-accent-purple hover:underline align-middle"
              >
                <h2 className="inline font-medium align-middle">
                  Sentry Error Monitoring
                </h2>
              </a>
            </div>
            <p className="text-base text-left text-[var(--gray-500)] pl-2 pr-4">
              Monitor, identify, and resolve errors and performance issues across your
              applications using
              <a
                href="/product/sentry/issues/"
                className="text-accent-purple hover:underline"
              >
                {' '}
                error monitoring
              </a>
              ,
              <a
                href="/product/sentry/explore/trace-explorer/"
                className="text-accent-purple hover:underline"
              >
                {' '}
                tracing
              </a>
              ,
              <a
                href="/product/sentry/explore/session-replay/"
                className="text-accent-purple hover:underline"
              >
                {' '}
                session replay
              </a>
              , and
              <a href="/product/" className="text-accent-purple hover:underline">
                {' '}
                more
              </a>
              .
            </p>
          </div>
          {/* Column 2: AI in Sentry */}
          <div>
            <div className="flex items-center mb-4 gap-2 min-h-[32px]">
              <PlatformIcon platform="sentry" size={24} format="lg" />
              <a
                href="/product/ai-in-sentry/"
                className="text-xl font-medium text-accent-purple hover:underline align-middle"
              >
                <h2 className="inline font-medium align-middle">AI in Sentry</h2>
              </a>
            </div>
            <p className="text-base text-left text-[var(--gray-500)] pl-2 pr-4">
              Fix code faster by having{' '}
              <a
                href="/product/ai-in-sentry/seer/"
                className="text-accent-purple hover:underline"
              >
                Seer
              </a>{' '}
              automatically find and remedy the root cause of your issues. Ask{' '}
              <a
                href="/product/ai-in-sentry/sentry-prevent-ai/"
                className="text-accent-purple hover:underline"
              >
                Sentry Prevent AI
              </a>{' '}
              to review your PRs, suggest improvements, and build tests.
            </p>
          </div>
        </div>
        <div id="all-sdks">
          <PlatformFilter />
        </div>
        <h2 className="text-2xl mt-16 mb-6 font-medium">Get to know us</h2>
        <div className="flex flex-wrap gap-6">
          <Card
            className="w-full"
            href="/product/sentry/"
            image={RocketImage}
            imageAlt="Rocket image"
            title="What is Sentry?"
            description={
              'Application monitoring and debugging software considered "not bad" by 4 million developers.'
            }
          />

          <Card
            className="w-full md:w-[calc(50%-12px)]"
            href="/organization"
            image={OrganizationImage}
            imageAlt="Organization image"
            title="Organization settings"
            description="Information for setting up your organization's Sentry account."
          />

          <Card
            className="w-full md:w-[calc(50%-12px)]"
            href="/pricing"
            image={CalculatorImage}
            imageAlt="Calculator image"
            title="Pricing & Billing"
            description="All about our pricing and billing structure."
          />

          <Card
            className="w-full md:w-[calc(50%-12px)]"
            href="/api"
            image={PlugImage}
            imageAlt="Plug image"
            title="API"
            description="APIs for accessing Sentry programmatically."
          />

          <Card
            className="w-full md:w-[calc(50%-12px)]"
            href="/cli"
            image={TerminalImage}
            imageAlt="Terminal image"
            title="CLI"
            description="How to use 'sentry-cli' on the command line."
          />

          <Card
            className="w-full md:w-[calc(50%-12px)]"
            href="/security-legal-pii"
            image={SecurityImage}
            imageAlt="Stamped paper image"
            title="Security, Legal & PII"
            description="Security, compliance, and data-scrubbing processes."
          />

          <Card
            className="w-full md:w-[calc(50%-12px)]"
            href="/concepts"
            image={ConceptsImage}
            imageAlt="Concept and references image"
            title="Concepts & Reference"
            description="Core concepts that make Sentry, Sentry."
          />
        </div>
        <h2 className="text-2xl mt-10 mb-6 font-medium">Talk to us</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Card
            className="w-full"
            href="https://discord.com/invite/sentry"
            image={ChatBubble}
            imageAlt="Chat bubble image"
            title="Sentry Discord"
            description="Real talk in real time. Get in it."
          />

          <Card
            className="w-full"
            href="https://sentry.zendesk.com/hc/en-us/"
            image={SupportImage}
            imageAlt="Support image"
            title="Support"
            description="See how we can help."
          />
        </div>
      </div>
      <footer className="mt-12 pb-10 w-full z-50 max-w-7xl mx-auto md:px-6 space-y-4 px-6 lg:px-8">
        <div className="flex md:items-center flex-wrap md:flex-row flex-col md:space-x-2 space-y-2 md:space-y-0 items-start px-3 pt-10 border-t border-gray">
          <FooterLink href="/security-legal-pii/">Security, Legal & PII</FooterLink>
          <FooterLink href="/contributing">Contribute</FooterLink>
          <FooterLink href="https://sentry.zendesk.com/hc/en-us/" external>
            Support
          </FooterLink>
          <FooterLink href="https://develop.sentry.dev/self-hosted/" external>
            Self-hosting Sentry
          </FooterLink>
          <FooterLink href="https://develop.sentry.dev/" external>
            Developer docs
          </FooterLink>
          <FooterLink href="https://discord.com/invite/sentry">
            Sentry discord
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              viewBox="0 0 16 13"
              fill="none"
              className="inline-block ml-1 fill-[var(--foreground)]"
            >
              <path d="M13.5535 1.01557C12.5023 0.5343 11.3926 0.192868 10.2526 0C10.0966 0.278859 9.95549 0.565767 9.82978 0.859525C8.61551 0.676548 7.38069 0.676548 6.16642 0.859525C6.04065 0.565798 5.8995 0.278893 5.74358 0C4.6029 0.194497 3.49241 0.536739 2.44013 1.01809C0.351097 4.10886 -0.215208 7.12286 0.0679445 10.0941C1.29134 10.998 2.66066 11.6854 4.11639 12.1265C4.44418 11.6856 4.73423 11.2179 4.98347 10.7283C4.51008 10.5515 4.05318 10.3334 3.61805 10.0765C3.73257 9.99339 3.84457 9.90782 3.9528 9.82476C5.21892 10.4202 6.60084 10.7289 7.99999 10.7289C9.39914 10.7289 10.7811 10.4202 12.0472 9.82476C12.1567 9.91411 12.2687 9.99969 12.3819 10.0765C11.946 10.3338 11.4882 10.5524 11.014 10.7296C11.2629 11.2189 11.553 11.6863 11.8811 12.1265C13.338 11.6872 14.7084 11.0001 15.932 10.0953C16.2643 6.64968 15.3645 3.66336 13.5535 1.01557ZM5.34213 8.26679C4.55308 8.26679 3.9012 7.55073 3.9012 6.66981C3.9012 5.78889 4.53043 5.06654 5.33961 5.06654C6.1488 5.06654 6.79565 5.78889 6.7818 6.66981C6.76796 7.55073 6.14628 8.26679 5.34213 8.26679ZM10.6578 8.26679C9.86754 8.26679 9.21817 7.55073 9.21817 6.66981C9.21817 5.78889 9.8474 5.06654 10.6578 5.06654C11.4683 5.06654 12.1101 5.78889 12.0963 6.66981C12.0824 7.55073 11.462 8.26679 10.6578 8.26679Z" />
            </svg>
          </FooterLink>
        </div>
        <p className="px-3 text-sm">
          © {new Date().getFullYear()} • Sentry is a registered trademark of Functional
          Software, Inc.
        </p>
        <div className="bg-accent-purple max-w-max md:ml-auto ml-2 px-5">
          <SentryWordmarkLogo height={50} fill="#ffffff" />
        </div>
      </footer>
      <AskAiSearchParams />
      <style>{`
        .card-large-icon img {
          width: 40px !important;
          height: 40px !important;
        }
        .card-align-center > div,
        .card-align-center .flex {
          align-items: center !important;
        }
        .home-search-bar input[type="text"], .home-search-bar input {
          height: 64px !important;
          min-height: 64px !important;
          font-size: 1.25rem !important;
          max-width: 480px !important;
          width: 100% !important;
          background: linear-gradient(90deg, #fff 80%, #f3e8ff 100%);
          border: 2px solid #a78bfa !important;
          box-shadow: 0 4px 24px 0 rgba(168,139,250,0.10), 0 1.5px 8px 0 rgba(168,139,250,0.08);
          border-radius: 18px !important;
          color: #1a1a1a;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .home-search-bar input[type="text"]:focus, .home-search-bar input:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 6px 32px 0 rgba(124,58,237,0.18), 0 2px 12px 0 rgba(124,58,237,0.12);
          outline: none !important;
        }
        .dark .home-search-bar input[type="text"], .dark .home-search-bar input {
          background: linear-gradient(90deg, #18181b 80%, #312e38 100%) !important;
          border: 2px solid #a78bfa !important;
          color: #f3f3f3 !important;
          box-shadow: 0 4px 24px 0 rgba(124,58,237,0.10), 0 1.5px 8px 0 rgba(124,58,237,0.08);
        }
        .dark .home-search-bar input[type="text"]:focus, .dark .home-search-bar input:focus {
          border-color: #c4b5fd !important;
          box-shadow: 0 6px 32px 0 rgba(124,58,237,0.18), 0 2px 12px 0 rgba(124,58,237,0.12);
        }
      `}</style>
    </div>
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
