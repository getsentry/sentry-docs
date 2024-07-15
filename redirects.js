const isDeveloperDocs = !!process.env.NEXT_PUBLIC_DEVELOPER_DOCS;

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const developerDocsRedirects = [];

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const sdkDocsRedirects = [
  {
    source: '/platforms/javascript/guides/:path*/best-practices/browser-extensions/',
    destination:
      '/platforms/javascript/guides/:path*/best-practices/shared-environments/',
  },
];

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
  return (isDeveloperDocs ? developerDocsRedirects : sdkDocsRedirects).map(r => {
    return {...r, permanent: true};
  });
};

module.exports = {redirects};
