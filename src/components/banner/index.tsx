'use client';

import {useEffect, useState} from 'react';

import styles from './banner.module.scss';

type BannerType = {
  appearsOn: (string | RegExp)[];
  linkText: string;
  linkURL: string;
  text: string;
};

// BANNERS is an array of banner objects. You can add as many as you like. If
// you need to disable all banners, set BANNERS to an empty array. Each banner
// is evaluated in order, and the first one that matches will be shown.
//
// Banner Object Properties:
//
//   - appearsOn: An array of RegExps or strings to feed into new RegExp()
//   - text: String for the text of the banner
//   - linkURL: String that is the destination url of the call to action button
//   - linkText: String that is the label for the call to action button
//
// Example:
//
// Examples:
// const SHOW_BANNER_ON = [];              // This is disabled
// const SHOW_BANNER_ON = ['^/$'];         // This is enabled on the home page
// const SHOW_BANNER_ON = ['^/welcome/'];  // This is enabled on the "/welcome" page
// const BANNER_TEXT =
//  'your message here';
// const BANNER_LINK_URL =
//  'link here';
// const BANNER_LINK_TEXT = 'your cta here';
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
  {
    // Match the homepage
    appearsOn: ['^/$'],
    text: 'This is a banner for the homepage',
    linkURL: 'https://sentry.io/',
    linkText: 'RSVP',
  },
  // javascript -> Astro example
  {
    appearsOn: ['^/platforms/javascript/guides/astro/'],
    text: 'This banner appears on the Astro guide',
    linkURL: 'https://sentry.io/thought-leadership',
    linkText: 'Get webinarly',
  },
  // generic javascript example
  {
    // we can constrain it to the javascript platform page only
    // by adding a more specific regex ie '^/platforms/javascript/$'
    appearsOn: ['^/platforms/javascript/'],
    text: 'This banner appears on the JavaScript platform page and all subpages',
    linkURL: 'https://sentry.io/thought-leadership',
    linkText: 'Get webinarly',
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

    // Bail if no banner matches this page
    if (!matchingBanner) {
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

  return banner ? (
    <div className={[styles['promo-banner']].filter(Boolean).join(' ')}>
      <div className={styles['promo-banner-message']}>
        <span className="flex gap-4">
          {banner.text}
          <a href={banner.linkURL}>{banner.linkText}</a>
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
  ) : null;
}
