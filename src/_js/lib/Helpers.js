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
