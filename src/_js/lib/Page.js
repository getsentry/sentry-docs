import { canonicalPath, canonicalUrl } from './Helpers';

export const logPageview = function() {
  window.amplitude.getInstance().logEvent('Viewed Docs Page', {
    path: canonicalPath(),
    referrer: document.referrer,
    search: location.search,
    title: document.title,
    url: canonicalUrl(location.search)
  });
  window.ra.page();
  if (window.gtag) {
    window.gtag('config', 'UA-30327640-1', { anonymize_ip: true });
    window.gtag('config', 'UA-30327640-3', { anonymize_ip: true });
  }
};
