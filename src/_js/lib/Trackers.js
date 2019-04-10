import { logGooglePageview } from './Page';

export const google = function(clicked_consent) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    dataLayer.push(arguments);
  }
  window.gtag('js', new Date());
  if (clicked_consent) {
    // Don't log pageview if user has already consented because we already do it in User.js.
    logGooglePageview();
  }

  const script = document.createElement('script');
  script.setAttribute(
    'src',
    'https://www.googletagmanager.com/gtag/js?id=UA-30327640-1'
  );
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('async', true);
  script.setAttribute('defer', true);
  document.body.appendChild(script);
};

export const amplitude = function() {
  // Loading this script adds a network hop but ensures that no tracking
  // cookies are added unless explicit permission is granted. It also allows
  // the stubbed Amplitude function calls to queue up until the library is
  // loaded and configured.
  const as = document.createElement('script');
  as.type = 'text/javascript';
  as.async = true;
  as.src = window.analyticsAssetURL;
  as.onload = function() {
    window.amplitude
      .getInstance()
      .init('ba62b82db20ab8dc707875f4534366c1', null, {
        saveParamsReferrerOncePerSession: false,
        includeGclid: true,
        includeReferrer: true,
        includeUtm: true,
        trackingOptions: {
          city: false,
          ip_address: false,
          dma: false
        }
      });
    window.amplitude.runQueuedFunctions();
  };
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(as, s);
};
