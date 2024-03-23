'use client';

import {Nav, NavItem} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Banner} from 'sentry-docs/components/banner';
import ChatBubble from 'sentry-docs/imgs/chat-bubble.png';
import HeroImage from 'sentry-docs/imgs/home_illustration.png';
import RocketImage from 'sentry-docs/imgs/rocket.png';
import SupportImage from 'sentry-docs/imgs/support.png';
import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import {PlatformIcon} from './platformIcon';
import {Search} from './search';
import {SmartLink} from './smartLink';

interface Props {
  visiblePlatforms: Array<Platform | PlatformGuide>;
}

export function HomeClient({visiblePlatforms}: Props) {
  const pathname = usePathname() ?? undefined;
  return (
    <div className="tw-app">
      <div className="index-navbar-wrapper md:px-4 border-b">
        <div className="index-navbar">
          <a href="/" title="Sentry error monitoring" className="index-logo">
            <Image src={SentryLogoSVG} width={54} height={50} alt="Sentry's logo" />
            Docs
          </a>
          <Nav className="justify-content-start" style={{flex: 1}}>
            <NavItem>
              <Link className="nav-link" href="/api/">
                API
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" href="https://sentry.io/changelog">
                Changelog
              </Link>
            </NavItem>
            <Nav.Item>
              <Nav.Link href="https://try.sentry-demo.com/demo/start/" target="_blank">
                Sandbox
              </Nav.Link>
            </Nav.Item>
            <NavItem>
              <Link className="nav-link" href="https://sentry.io/">
                Sign In
              </Link>
            </NavItem>
          </Nav>
          <div>
            <Search path={pathname} platforms={[]} />
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg px-2 mx-auto">
        <div className="flex flex-col md:flex-row gap-6 py-8 mx-auto justify-between">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-[40px]">Welcome to Sentry Docs</h1>
            <p className="max-w-[50ch]">
              Sentry is a developer-first error tracking and performance monitoring
              platform.
            </p>
          </div>
          <div>
            <Image src={HeroImage} height={240} alt="Sentry's hero image" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-2 py-8 md:items-end">
          <div className="md:w-1/2">
            <h2 className="text-2xl">Choose your SDK</h2>
            <p className="m-0">If you use it, we probably support it.</p>
          </div>
          <input
            className="w-full md:w-1/2 p-2 rounded border-[#D2C7DA]"
            placeholder="Find your language or framework"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
          {visiblePlatforms.map(platform => (
            <SmartLink
              to={platform.url}
              className="text-black hover:no-underline"
              key={platform.key}
            >
              <div className="flex gap-2 shadow-md rounded p-2">
                <div className="w-5 flex">
                  <PlatformIcon
                    size={20}
                    platform={platform.icon ?? platform.key}
                    format="lg"
                  />
                </div>
                {platform.title}
              </div>
            </SmartLink>
          ))}
        </div>
        <Link href="/product/sentry-basics/" className="hover:no-underline text-black">
          <div className="flex flex-col md:flex-row shadow-md p-6 rounded mt-9 gap-4">
            <Image src={RocketImage} height={64} alt="Rocket image" />
            <div className="hover:no-underline">
              <h3 className="text-xl">What is Sentry?</h3>
              <p>Sentry is an application monitoring platform—built by devs, for devs.</p>
            </div>
          </div>
        </Link>
        <h2 className="text-2xl mt-12 md:mt-16 mb-6">Talk to us</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Link
            href="https://discord.com/invite/sentry"
            className="hover:no-underline text-black w-full"
          >
            <div className="flex flex-col md:flex-row shadow-md p-6 rounded gap-4">
              <Image src={ChatBubble} height={64} alt="Chat bubble image" />
              <div>
                <h3 className="text-xl">Sentry Discord</h3>
                <p>Real talk in real time. Get in it.</p>
              </div>
            </div>
          </Link>
          <Link
            href="https://help.sentry.io/"
            className="hover:no-underline text-black w-full"
          >
            <div className="flex flex-col md:flex-row shadow-md p-6 rounded gap-4">
              <Image src={SupportImage} height={64} alt="Support image" />
              <div>
                <h3 className="text-xl">Support</h3>
                <p>See how we can help.</p>
              </div>
            </div>
          </Link>
        </div>
        <Banner />
      </div>
    </div>
  );
}
