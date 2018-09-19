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
  gtag('config', 'UA-47053361-1');

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
