import {Tooltip} from '@radix-ui/themes';

import {Banner} from 'sentry-docs/components/banner';
import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';
import PlugImage from 'sentry-docs/imgs/api.png';
import ChatBubble from 'sentry-docs/imgs/chat-bubble.png';
import TerminalImage from 'sentry-docs/imgs/cli.png';
import ConceptsImage from 'sentry-docs/imgs/concepts-reference.png';
import OrganizationImage from 'sentry-docs/imgs/organization.png';
import CalculatorImage from 'sentry-docs/imgs/pricing.png';
import RocketImage from 'sentry-docs/imgs/rocket.png';
import SecurityImage from 'sentry-docs/imgs/security.png';
import SupportImage from 'sentry-docs/imgs/support.png';

import AskAiSearchParams from './askAiSearchParams';
import {Card} from './card';
import Header from './header';
import {NavLink, NavLinkProps} from './navlink';
import {PlatformFilter} from './platformFilter';
import {PlatformIcon} from './platformIcon';
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
      <div className="flex justify-center mt-40 mb-0">
        <input
          type="text"
          placeholder="Search Docs"
          className="w-full max-w-xl px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-purple text-lg"
        />
      </div>
      <div className="hero max-w-screen-xl mx-auto px-6 lg:px-8 py-2">
        {/* New Top Row: Docs intro + Most Viewed SDKs */}
        <div
          className="w-full flex flex-col md:flex-row gap-8 items-start mb-12"
          style={{paddingTop: '70px'}}
        >
          {/* Left column: Header and subheader */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold mb-2">Welcome to Sentry Docs</h1>
            <p className="text-lg">
              Sentry provides end-to-end distributed tracing, enabling developers to
              identify and debug performance issues and errors across their systems and
              services.
            </p>
          </div>
          {/* Right column: Most Viewed SDKs */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-4">
            <div
              className="bg-white dark:bg-[var(--gray-2)] rounded-xl shadow-md dark:shadow-none p-6 pt-14 pb-14 w-full max-w-md aspect-square flex flex-col items-start"
              style={{
                width: '350px',
                minHeight: '350px',
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
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
                  gridTemplateColumns: 'repeat(3, 50px)',
                  gridTemplateRows: 'repeat(3, 50px)',
                  gap: '10px',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                {mostViewedSDKs.map(platform => (
                  <Tooltip content={platform.title} key={platform.key}>
                    <a
                      href={platform.url}
                      style={{
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
        {/* Sentry Products Header */}
        <h2 className="text-2xl mt-16 mb-6 font-medium">Sentry Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 md:items-start">
          {/* Column 1: Sentry */}
          <div>
            <div className="flex flex-row items-center mb-4 gap-2">
              <PlatformIcon platform="sentry" size={24} format="lg" />
              <h2 className="text-xl font-medium">Sentry</h2>
            </div>
            <div className="flex flex-col gap-3">
              <Card
                href="/issues"
                title="Issues"
                description=""
                image={SupportImage}
                imageAlt="Issues image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
              <Card
                href="/logs"
                title="Logs"
                description=""
                image={TerminalImage}
                imageAlt="Logs image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
              <Card
                href="/explore"
                title="Explore"
                description=""
                image={ConceptsImage}
                imageAlt="Explore image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
            </div>
            <div className="px-4">
              <hr className="my-2 border-gray-200" />
              <a
                href="#"
                className="inline-block text-accent-purple hover:underline font-medium text-base"
              >
                More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          {/* Column 2: Sentry Prevent */}
          <div>
            <div className="flex flex-row items-center mb-4 gap-2">
              <PlatformIcon platform="sentry" size={24} format="lg" />
              <h2 className="text-xl font-medium">Sentry Prevent</h2>
            </div>
            <div className="flex flex-col gap-3">
              <Card
                href="/test"
                title="Test"
                description=""
                image={RocketImage}
                imageAlt="Test image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
              <Card
                href="/coverage"
                title="Coverage"
                description=""
                image={CalculatorImage}
                imageAlt="Coverage image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
            </div>
            <div className="px-4">
              <hr className="my-2 border-gray-200" />
              <a
                href="#"
                className="inline-block text-accent-purple hover:underline font-medium text-base"
              >
                More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          {/* Column 3: Seer */}
          <div>
            <div className="flex flex-row items-center mb-4 gap-2">
              <PlatformIcon platform="sentry" size={24} format="lg" />
              <h2 className="text-xl font-medium">Seer</h2>
            </div>
            <div className="flex flex-col gap-3">
              <Card
                href="/autofix"
                title="Autofix"
                description=""
                image={PlugImage}
                imageAlt="Autofix image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
              <Card
                href="/issue-summary"
                title="Issue Summary"
                description=""
                image={OrganizationImage}
                imageAlt="Issue Summary image"
                className="min-h-[60px] h-[60px] card-large-icon card-align-center"
              />
            </div>
            <div className="px-4">
              <hr className="my-2 border-gray-200" />
              <a
                href="#"
                className="inline-block text-accent-purple hover:underline font-medium text-base"
              >
                More <span aria-hidden="true">→</span>
              </a>
            </div>
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
