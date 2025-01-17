'use client';

import {useEffect, useState} from 'react';

import styles from './banner.module.scss';

type BannerType = {
  /** This is an array of strings or RegExps to feed into new RegExp() */
  appearsOn: (string | RegExp)[];
  /** The label for the call to action button */
  linkText: string;
  /** The destination url of the call to action button */
  linkURL: string;
  /** The main text of the banner */
  text: string;
  /** Optional ISO Date string that will hide the banner after this date without the need for a rebuild */
  expiresOn?: string;
};

// BANNERS is an array of banner objects. You can add as many as you like. If
// you need to disable all banners, simply delete them from the array. Each banner
// is evaluated in order, and the first one that matches will be shown.
//
// Examples:
// appearsOn = [];              // This is disabled
// appearsOn = ['^/$'];         // This is enabled on the home page
// appearsOn = ['^/welcome/'];  // This is enabled on the "/welcome" page
// const BANNERS = [
//
//   This one will take precedence over the last banner in the array
//   (which matches all /platforms pages), because it matches first.
//   {
//     appearsOn: ['^/platforms/javascript/guides/astro/'],
//     text: 'This banner appears on the Astro guide',
//     linkURL: 'https://sentry.io/thought-leadership',
//     linkText: 'Get webinarly',
//   },
//
//   // This one will match the /welcome page and all /for pages
//   {
//     appearsOn: ['^/$', '^/platforms/'],
//     text: 'This banner appears on the home page and all /platforms pages',
//     linkURL: 'https://sentry.io/thought-leadership',
//     linkText: 'Get webinarly',
//   },
// ];

const BANNERS: BannerType[] = [
  /// ⚠️ KEEP THIS LAST BANNER ACTIVE FOR DOCUMENTATION
  // check it out on `/contributing/pages/banners/`
  {
    appearsOn: ['^/contributing/pages/banners/'],
    text: 'Edit this banner on `/src/components/banner/index.tsx`',
    linkURL: 'https://docs.sentry.io/contributing/pages/banners/',
    linkText: 'CTA',
  },
  {
    appearsOn: ['^/$'],
    text: 'Check out Sentry Launch Week for our latest product releases.',
    linkURL: 'https://sentry.io/events/launch-week/?promo_name=launchweekQ4FY2024',
    linkText: 'See what’s new.',
  },
  {
    appearsOn: [
      '^/platforms/flutter/',
      '^/platforms/react-native/',
      '^/platforms/android/',
      '^/platforms/apple/guides/ios/',
    ],
    text: 'Session Replay is now generally available for mobile.',
    linkURL: 'https://docs.sentry.io/product/explore/session-replay/mobile/',
    linkText: 'Get started today.',
  },
];

const LOCALSTORAGE_NAMESPACE = 'banner-manifest';

// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
const fastHash = (input: string) => {
  let hash = 0;
  if (input.length === 0) {
    return hash;
  }
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const readOrResetLocalStorage = () => {
  const stored = localStorage.getItem(LOCALSTORAGE_NAMESPACE);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (e) {
    localStorage.removeItem(LOCALSTORAGE_NAMESPACE);
    return null;
  }
};

export function Banner() {
  type BannerWithHash = BannerType & {hash: string};
  const [banner, setBanner] = useState<BannerWithHash | null>(null);

  useEffect(() => {
    const matchingBanner = BANNERS.find(b => {
      return b.appearsOn.some(matcher =>
        new RegExp(matcher).test(window.location.pathname)
      );
    });

    // Bail if no banner matches this page or if the banner has expired
    if (
      !matchingBanner ||
      (matchingBanner.expiresOn &&
        new Date() > new Date(matchingBanner.expiresOn ?? null))
    ) {
      return;
    }

    const manifest = readOrResetLocalStorage();
    const hash = fastHash(matchingBanner.text + matchingBanner.linkURL).toString();

    // Bail if this banner has already been seen
    if (manifest && manifest.indexOf(hash) >= 0) {
      return;
    }

    // Enable the banner
    setBanner({...matchingBanner, hash});
  }, []);

  if (!banner) {
    return null;
  }
  return (
    <div className={[styles['promo-banner']].filter(Boolean).join(' ')}>
      <div className={styles['promo-banner-message']}>
        <span className="flex flex-col md:flex-row gap-4">
          {banner.text}
          <a href={banner.linkURL} className="min-w-max">
            {banner.linkText}
          </a>
        </span>
      </div>
      <button
        className={styles['promo-banner-dismiss']}
        role="button"
        onClick={() => {
          const manifest = readOrResetLocalStorage() || [];
          const payload = JSON.stringify([...manifest, banner.hash]);
          localStorage.setItem(LOCALSTORAGE_NAMESPACE, payload);
          setBanner(null);
        }}
      >
        ×
      </button>
    </div>
  );
}
