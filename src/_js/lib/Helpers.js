export const fullPath = function({ pathname: target, hash, search }) {
  return `${target}${search || ''}${hash || ''}`;
};

export const escape = function(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

// Lifted from analytics.js - helpers to determine the canonical
// values for page load event properties
export const canonical = function() {
  const tags = document.getElementsByTagName('link');
  // eslint-disable-next-line no-cond-assign
  for (let i = 0, tag; (tag = tags[i]); i++) {
    if (tag.getAttribute('rel') === 'canonical') {
      return tag.getAttribute('href');
    }
  }
};

export const canonicalPath = function() {
  const canon = canonical();
  if (!canon) return window.location.pathname;
  const a = document.createElement('a');
  a.href = canon;
  return a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname;
};

export const canonicalUrl = function(search) {
  const canon = canonical();
  if (canon) {
    return canon.indexOf('?') > -1 ? canon : canon + search;
  }
  const url = window.location.href;
  const i = url.indexOf('#');
  return i === -1 ? url : url.slice(0, i);
};
