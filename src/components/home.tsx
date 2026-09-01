import Image from 'next/image';
import Link from 'next/link';
import {type ReactNode} from 'react';
import {Banner} from 'sentry-docs/components/banner';
import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';
import Cursor from 'sentry-docs/icons/cursor';
import GitHub from 'sentry-docs/icons/github';
import Jira from 'sentry-docs/icons/jira';
import Slack from 'sentry-docs/icons/slack';
import Vercel from 'sentry-docs/icons/vercel';
import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';

import AskAiSearchParams from './askAiSearchParams';
import {Header} from './header';
import styles from './home.module.scss';
import {HomeAiSetupCard} from './homeAiSetupCard';
import {PlatformFilter} from './platformFilter';
import {SentryWordmarkLogo} from './wordmarkLogo';

export async function Home() {
  const rootNode = await getDocsRootNode();
  const platforms = extractPlatforms(rootNode);
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
        <section className={`w-full relative ${styles.heroGradient}`}>
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8 pt-16 pb-10 text-center relative z-10">
            <div className={styles.heroTitle}>
              <Image
                src={SentryLogoSVG}
                alt=""
                width={96}
                height={88}
                className={styles.heroLogo}
              />
              <h1
                className="font-bold text-[var(--gray-12)] dark:text-white mb-0"
                style={{fontSize: '40px', lineHeight: 1.15, letterSpacing: '-0.02em'}}
              >
                Get started with Sentry
              </h1>
            </div>
            <p
              className="text-[var(--gray-11)] dark:text-[var(--gray-11)] max-w-2xl mx-auto mb-8 text-balance"
              style={{fontSize: '17px', lineHeight: 1.5}}
            >
              Everything you need to catch errors, trace performance, and fix broken
              agents.
            </p>
          </div>
        </section>

        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 pb-4">
          <HomeAiSetupCard />
        </section>

        <section
          id="platforms"
          className="max-w-screen-lg mx-auto px-4 sm:px-8 pb-6 scroll-mt-[var(--header-height)]"
        >
          <div className={styles.orDivider} role="separator" aria-label="or">
            <span>or</span>
          </div>

          <div className={styles.manualHeader}>
            <div className={styles.setupIcon}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
                <path d="M6.5 9l3 3-3 3" />
                <path d="M12.5 15h5" />
              </svg>
            </div>
            <div>
              <h2 className={styles.setupTitle}>Set up manually</h2>
              <p className={styles.setupDesc}>
                Pick your platform below and follow our step-by-step guides to install the
                SDK and send your first event.
              </p>
            </div>
          </div>

          <PlatformFilter />
        </section>

        <section
          id="integrations"
          className="max-w-screen-lg mx-auto px-4 sm:px-8 pb-6 scroll-mt-[var(--header-height)]"
        >
          <div className="space-y-2 py-8">
            <h2 className="text-xl font-semibold">
              <Link
                href="/integrations/"
                className="text-[var(--gray-12)] no-underline hover:text-[var(--accent-purple)]"
              >
                Integrations
              </Link>
            </h2>
            <p className="m-0">
              Connect your favorite apps and services to add features that help track and
              triage your errors.{' '}
              <Link href="/integrations/" className={styles.seeAllLink}>
                See all integrations
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <QuickLink
              href="/integrations/source-code-mgmt/github/"
              title="GitHub"
              desc="Suspect commits, stack traces, and PR comments."
              icon={<GitHub width={20} height={20} aria-hidden />}
            />
            <QuickLink
              href="/integrations/notification-incidents/slack/"
              title="Slack"
              desc="Alerts, issue actions, and Seer in Slack."
              icon={<Slack width={20} height={20} aria-hidden />}
            />
            <QuickLink
              href="/integrations/issue-tracking/jira/"
              title="Jira"
              desc="Create and sync Jira issues from Sentry."
              icon={<Jira width={20} height={20} aria-hidden />}
            />
            <QuickLink
              href="/integrations/deployment/vercel/"
              title="Vercel"
              desc="Deploy notifications and source map uploads."
              icon={<Vercel width={20} height={20} aria-hidden />}
            />
            <QuickLink
              href="/integrations/coding-agents/cursor/"
              title="Cursor"
              desc="Launch Cursor Cloud Agents from Seer."
              icon={<Cursor width={20} height={20} aria-hidden />}
            />
          </div>
        </section>

        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 pb-16">
          <div className="space-y-2 py-8">
            <h2 className="text-xl font-semibold">Learn More</h2>
          </div>
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
            <QuickLink href="/api/" title="API" desc="Access Sentry programmatically." />
            <QuickLink
              href="/ai/"
              title="Sentry for AI"
              desc="See all the ways Sentry plugs into your agents and workflows."
            />
          </div>
        </section>
      </main>
      <footer className="mt-12 pb-10 w-full z-50 max-w-7xl mx-auto md:px-6 px-6 lg:px-8">
        <div className="pt-10 border-t border-[var(--gray-a4)] flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <FooterLink href="/security-legal-pii/">
                Security, Legal &amp; PII
              </FooterLink>
              <FooterLink href="/contributing">Contribute</FooterLink>
              <FooterLink href="https://www.sentry.help/en/" external>
                Support
              </FooterLink>
              <FooterLink href="https://sentry.io/changelog/" external>
                Changelog
              </FooterLink>
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
            <p className="text-sm text-[var(--gray-11)]">
              © {new Date().getFullYear()} • Sentry is a registered trademark of
              Functional Software, Inc.
            </p>
          </div>
          <SentryWordmarkLogo
            role="img"
            aria-label="Sentry"
            width={128}
            height={38}
            className="text-[var(--foreground)] shrink-0"
          />
        </div>
      </footer>
      <AskAiSearchParams />
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
  icon,
}: {
  desc: string;
  href: string;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <Link href={href} className={`${styles.quickLink} no-underline`}>
      <div className={styles.quickLinkTitle}>
        {icon}
        {title}
      </div>
      <div className="text-sm text-[var(--gray-11)] leading-snug">{desc}</div>
    </Link>
  );
}

function FooterLink({
  children,
  href,
  external,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gray-11)] hover:text-[var(--foreground)] transition-colors no-underline"
    >
      {children}
      {external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          className="opacity-60"
        >
          <path d="M10 0C9.44687 0 9 0.446875 9 1C9 1.55313 9.44687 2 10 2H12.5844L6.29375 8.29375C5.90312 8.68437 5.90312 9.31875 6.29375 9.70938C6.68437 10.1 7.31875 10.1 7.70937 9.70938L14 3.41563V6C14 6.55312 14.4469 7 15 7C15.5531 7 16 6.55312 16 6V1C16 0.446875 15.5531 0 15 0H10ZM2.5 1C1.11875 1 0 2.11875 0 3.5V13.5C0 14.8813 1.11875 16 2.5 16H12.5C13.8813 16 15 14.8813 15 13.5V10C15 9.44687 14.5531 9 14 9C13.4469 9 13 9.44687 13 10V13.5C13 13.775 12.775 14 12.5 14H2.5C2.225 14 2 13.775 2 13.5V3.5C2 3.225 2.225 3 2.5 3H6C6.55312 3 7 2.55312 7 2C7 1.44687 6.55312 1 6 1H2.5Z" />
        </svg>
      )}
    </Link>
  );
}
