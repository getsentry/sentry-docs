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
};
