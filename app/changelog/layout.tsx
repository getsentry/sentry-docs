import './globals.css';
import 'prism-sentry/index.css';

import {ReactNode} from 'react';
import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';

import {Navbar} from 'sentry-docs/components/changelog/navbar';

const rubik = localFont({
  src: [
    {
      path: '../../src/fonts/rubik-regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../src/fonts/rubik-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../src/fonts/rubik-italic.woff2',
      weight: 'normal',
      style: 'italic',
    },
  ],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: {template: '%s | Sentry Changelog', default: 'Changelog'},
};

export default function ChangelogLayout({
  children,
  left,
  right,
}: {
  children: ReactNode;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <Theme accentColor="violet" grayColor="sand" radius="large" scaling="95%">
      <div className={`${rubik.variable} font-sans`}>
        <Navbar />
        <div className="w-full mx-auto h-96 relative bg-darkPurple">
          <div className="relative w-full lg:max-w-7xl mx-auto px-4 lg:px-8 pt-8 grid grid-cols-12 items-center">
            <Image
              className="justify-self-center col-span-10 z-20 hidden lg:block"
              src="/changelog/assets/hero.png"
              alt="Sentry Changelog"
              height={273}
              width={450}
            />
            <div className="relative col-span-12 mt-32 lg:absolute lg:w-96 lg:right-1/4 lg:-bottom-2">
              <h1 className="justify-self-center text-white font-bold text-4xl text-center lg:text-left">
                Sentry Changelog
              </h1>
              <h2 className="justify-self-center z-20 text-gold text-1xl text-center lg:text-left">
                Stay up to date on everything big and small, from product updates to SDK
                changes with the Sentry Changelog.
              </h2>
            </div>
          </div>
          <div className="hero-bottom-left-down-slope absolute bottom-0 w-full h-10 bg-gray-200" />
        </div>

        <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
          <div className="hidden md:block md:col-span-2 pl-5 pt-10">{left}</div>
          <div className="col-span-12 md:col-span-8">{children}</div>
          <div className="hidden md:block md:col-span-2 pl-5 pt-10">{right}</div>
        </div>

        <div className="w-full mx-auto h-16 relative bg-darkPurple">
          <div className="footer-top-right-down-slope absolute w-full -top-1 h-10 bg-gray-200" />
        </div>
      </div>
    </Theme>
  );
}
