export const fullPath = function({ pathname: target, hash, search }) {
  return `${target}${search || ''}${hash || ''}`;
};
