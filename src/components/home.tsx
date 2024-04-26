import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';

import {Banner} from 'sentry-docs/components/banner';
import {SentryWordmarkLogo} from 'sentry-docs/components/wordmarkLogo';
import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';
import ChatBubble from 'sentry-docs/imgs/chat-bubble.png';
import HeroImage from 'sentry-docs/imgs/home_illustration.png';
import RocketImage from 'sentry-docs/imgs/rocket.png';
import SupportImage from 'sentry-docs/imgs/support.png';

import {Header} from './header';
import {NavLink, NavLinkProps} from './navlink';
import {PlatformFilter} from './platformFilter';

const HIGHLIGHTED_PLATFORMS = [
  'javascript',
  'javascript.node',
  'python',
  'php',
  'ruby',
  'java',
  'react-native',
  'dotnet',
  'go',
  'android',
  'apple',
  'flutter',
  'unity',
  'unreal',
];

export async function Home() {
  const rootNode = await getDocsRootNode();
  if (!rootNode) {
    console.warn('no root node');
    return notFound();
  }

  const platformList = extractPlatforms(rootNode);

  // sort the highlighted platforms first by the order in HIGHLIGHTED_PLATFORMS
  const highlightedPlatforms = platformList
    .filter(platform => HIGHLIGHTED_PLATFORMS.includes(platform.key))
    .sort(
      (a, b) =>
        HIGHLIGHTED_PLATFORMS.indexOf(a.key) - HIGHLIGHTED_PLATFORMS.indexOf(b.key)
    );
  // this regex deals with names like .NET that would otherwise be sorted at the top
  const leadingNonAlphaRegex = /^[^\w]/;
  // then sort the rest of the platforms alphabetically
  const otherPlatforms = platformList
    .filter(platform => !HIGHLIGHTED_PLATFORMS.includes(platform.key))
    .sort((a, b) =>
      (a.title ?? a.name)
        .replace(leadingNonAlphaRegex, '')
        .localeCompare((b.title ?? b.name).replace(leadingNonAlphaRegex, ''))
    );

  const sortedPlatforms = [...highlightedPlatforms, ...otherPlatforms];

  return (
    <div className="tw-app">
      <Header pathname="/" searchPlatforms={[]} />
      <Banner />
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row gap-4 pb-10 mx-auto justify-between pt-24 lg:pt-[120px]">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-[40px] font-medium mb-2 leading-[1.2]">
              Welcome to Sentry Docs
            </h1>
            <p className="max-w-[55ch]">
              Sentry is a developer-first error tracking and performance monitoring
              platform.
            </p>
          </div>
          <div className="self-center">
            <Image
              src={HeroImage}
              alt="Sentry's hero image"
              className="max-h-[200px] w-full md:max-h-[390px]"
            />
          </div>
        </div>

        <PlatformFilter platforms={sortedPlatforms} />
        <Link href="/product/sentry-basics/">
          <div className="flex flex-col md:flex-row shadow p-6 rounded mt-16 gap-4">
            <Image src={RocketImage} height={64} alt="Rocket image" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium">What is Sentry?</h3>
              <p>Sentry is an application monitoring platform—built by devs, for devs.</p>
            </div>
          </div>
        </Link>
        <h2 className="text-2xl mt-12 md:mt-16 mb-6 font-medium">Talk to us</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Link href="https://discord.com/invite/sentry" className="w-full">
            <div className="flex flex-col md:flex-row shadow p-6 rounded gap-4">
              <Image src={ChatBubble} height={64} alt="Chat bubble image" />
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Sentry Discord</h3>
                <p>Real talk in real time. Get in it.</p>
              </div>
            </div>
          </Link>
          <Link href="https://sentry.zendesk.com/hc/en-us/" className="w-full">
            <div className="flex flex-col md:flex-row shadow p-6 rounded gap-4">
              <Image src={SupportImage} height={64} alt="Support image" />
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Support</h3>
                <p>See how we can help.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <footer className="mt-20 pb-10 w-full z-50 max-w-7xl mx-auto md:px-6 space-y-4 px-6 lg:px-8">
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
              className="inline-block ml-1 fill-darkPurple"
            >
              <path d="M13.5535 1.01557C12.5023 0.5343 11.3926 0.192868 10.2526 0C10.0966 0.278859 9.95549 0.565767 9.82978 0.859525C8.61551 0.676548 7.38069 0.676548 6.16642 0.859525C6.04065 0.565798 5.8995 0.278893 5.74358 0C4.6029 0.194497 3.49241 0.536739 2.44013 1.01809C0.351097 4.10886 -0.215208 7.12286 0.0679445 10.0941C1.29134 10.998 2.66066 11.6854 4.11639 12.1265C4.44418 11.6856 4.73423 11.2179 4.98347 10.7283C4.51008 10.5515 4.05318 10.3334 3.61805 10.0765C3.73257 9.99339 3.84457 9.90782 3.9528 9.82476C5.21892 10.4202 6.60084 10.7289 7.99999 10.7289C9.39914 10.7289 10.7811 10.4202 12.0472 9.82476C12.1567 9.91411 12.2687 9.99969 12.3819 10.0765C11.946 10.3338 11.4882 10.5524 11.014 10.7296C11.2629 11.2189 11.553 11.6863 11.8811 12.1265C13.338 11.6872 14.7084 11.0001 15.932 10.0953C16.2643 6.64968 15.3645 3.66336 13.5535 1.01557ZM5.34213 8.26679C4.55308 8.26679 3.9012 7.55073 3.9012 6.66981C3.9012 5.78889 4.53043 5.06654 5.33961 5.06654C6.1488 5.06654 6.79565 5.78889 6.7818 6.66981C6.76796 7.55073 6.14628 8.26679 5.34213 8.26679ZM10.6578 8.26679C9.86754 8.26679 9.21817 7.55073 9.21817 6.66981C9.21817 5.78889 9.8474 5.06654 10.6578 5.06654C11.4683 5.06654 12.1101 5.78889 12.0963 6.66981C12.0824 7.55073 11.462 8.26679 10.6578 8.26679Z" />
            </svg>
          </FooterLink>
        </div>
        <p className="px-3 text-sm">
          © 2023 • Sentry is a registered trademark of Functional Software, Inc.
        </p>
        <div className="bg-accent-purple max-w-max md:ml-auto ml-2 px-5">
          <SentryWordmarkLogo height={50} fill="#ffffff" />
        </div>
      </footer>
    </div>
  );
}

function FooterLink({
  children,
  ...props
}: NavLinkProps & {href: string; external?: boolean}) {
  const target = props.target ?? (props.href?.startsWith('http') ? '_blank' : undefined);

  return (
    <NavLink {...props} target={target}>
      {children}
      {props.external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          viewBox="0 0 16 16"
          fill="none"
          className="inline-block ml-2 fill-darkPurple"
        >
          <g>
            <path d="M10 0C9.44687 0 9 0.446875 9 1C9 1.55313 9.44687 2 10 2H12.5844L6.29375 8.29375C5.90312 8.68437 5.90312 9.31875 6.29375 9.70938C6.68437 10.1 7.31875 10.1 7.70937 9.70938L14 3.41563V6C14 6.55312 14.4469 7 15 7C15.5531 7 16 6.55312 16 6V1C16 0.446875 15.5531 0 15 0H10ZM2.5 1C1.11875 1 0 2.11875 0 3.5V13.5C0 14.8813 1.11875 16 2.5 16H12.5C13.8813 16 15 14.8813 15 13.5V10C15 9.44687 14.5531 9 14 9C13.4469 9 13 9.44687 13 10V13.5C13 13.775 12.775 14 12.5 14H2.5C2.225 14 2 13.775 2 13.5V3.5C2 3.225 2.225 3 2.5 3H6C6.55312 3 7 2.55312 7 2C7 1.44687 6.55312 1 6 1H2.5Z" />
          </g>
        </svg>
      )}
    </NavLink>
  );
}
