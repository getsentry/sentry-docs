const isDeveloperDocs = !!process.env.NEXT_PUBLIC_DEVELOPER_DOCS;

/** @type {import('next').Redirect[]} */
const developerDocsRedirects = [];

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const sdkDocsRedirects = [];

/**
 * @type {import('next').NextConfig['redirects']}
 *
 * loads the redirects based on the environment variable `NEXT_PUBLIC_DEVELOPER_DOCS`
 */
const redirects = async () => {
  console.log(
    '🔄 using',
    isDeveloperDocs ? 'developer' : 'sdk',
    'docs redirects in next.config.js'
  );
  if (isDeveloperDocs) {
    return developerDocsRedirects;
  } else {
    return sdkDocsRedirects;
  }
};

module.exports = {redirects};
