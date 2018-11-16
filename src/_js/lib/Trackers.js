export const facebook = function() {
  const img = document.createElement('img');
  img.src =
    'https://www.facebook.com/tr?id=280953929088736&ev=PageView&noscript=1';
  img.setAttribute('height', '1');
  img.setAttribute('width', '1');
  img.setAttribute('style', 'display:none;');
  img.setAttribute('alt', '');
  img.setAttribute('aria-hidden', 'true');
  document.body.appendChild(img);
};

export const hubspot = function() {
  const script = document.createElement('script');
  script.setAttribute('src', '//js.hs-scripts.com/3344477.js');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('id', 'hs-script-loader');
  script.setAttribute('async', true);
  script.setAttribute('defer', true);
  document.body.appendChild(script);
};

export const google = function() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'UA-47053361-1', { anonymize_ip: true });

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
