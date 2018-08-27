export const twitter = function() {
  const img1 = document.createElement('img');
  img1.src =
    'https://analytics.twitter.com/i/adsct?txn_id=nydby&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0';
  img1.setAttribute('height', '1');
  img1.setAttribute('width', '1');
  img1.setAttribute('style', 'display:none;');
  img1.setAttribute('alt', '');
  img1.setAttribute('aria-hidden', 'true');

  const img2 = document.createElement('img');
  img2.src =
    '//t.co/i/adsct?txn_id=nydby&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0';
  img2.setAttribute('height', '1');
  img2.setAttribute('width', '1');
  img2.setAttribute('style', 'display:none;');
  img2.setAttribute('alt', '');
  img2.setAttribute('aria-hidden', 'true');

  document.body.appendChild(img1);
  document.body.appendChild(img2);
};

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

export const linkedin = function() {
  window._linkedin_data_partner_id = '107517';
  const s = document.getElementsByTagName('script')[0];
  const b = document.createElement('script');
  b.type = 'text/javascript';
  b.async = true;
  b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  s.parentNode.insertBefore(b, s);
};

export const bing = function() {
  (function(w, d, t, r, u) {
    var f, n, i;
    (w[u] = w[u] || []),
      (f = function() {
        var o = { ti: '5751143' };
        (o.q = w[u]), (w[u] = new UET(o)), w[u].push('pageLoad');
      }),
      (n = d.createElement(t)),
      (n.src = r),
      (n.async = 1),
      (n.onload = n.onreadystatechange = function() {
        var s = this.readyState;
        (s && s !== 'loaded' && s !== 'complete') ||
          (f(), (n.onload = n.onreadystatechange = null));
      }),
      (i = d.getElementsByTagName(t)[0]),
      i.parentNode.insertBefore(n, i);
  })(window, document, 'script', '//bat.bing.com/bat.js', 'uetq');
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
};
