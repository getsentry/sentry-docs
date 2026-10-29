/**
 * Maps a redirect destination to its `.md` export. External URLs and
 * destinations with a query string are returned unchanged.
 * Shared by redirects.js (next.config redirects) and middleware.ts.
 *
 * @param {string} destination
 * @returns {string}
 */
function toMarkdownDestination(destination) {
  if (/^https?:\/\//.test(destination) || destination.includes('?')) {
    return destination;
  }
  const [path, hash] = destination.split('#');
  const mdPath = `${path.replace(/\/+$/, '') || '/index'}.md`;
  return hash === undefined ? mdPath : `${mdPath}#${hash}`;
}

module.exports = {toMarkdownDestination};
