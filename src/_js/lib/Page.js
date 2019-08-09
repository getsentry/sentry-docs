import { canonicalPath, canonicalUrl } from './Helpers';

export const logGooglePageview = function() {
  if (!window.gtag) return;

  const i = location.href.indexOf('#');
  const url = i === -1 ? location.href : location.href.slice(0, i);
  const payload = {
    anonymize_ip: true,
    page_title: document.title,
    page_location: url,
  };
  window.gtag('config', 'UA-30327640-1', payload);
  window.gtag('config', 'UA-30327640-3', payload);
};

export const logPageview = function() {
  window.amplitude.getInstance().logEvent('Viewed Docs Page', {
    path: canonicalPath(),
    referrer: document.referrer,
    search: location.search,
    title: document.title,
    url: canonicalUrl(location.search)
  });
  window.ra.page();
  logGooglePageview();
};
