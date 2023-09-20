/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import React from 'react';
import {GatsbySSR} from 'gatsby';

import {FeedbackWidgetLoader} from 'sentry-docs/components/feedback/feedbackWidgetLoader';
import {PageContext} from 'sentry-docs/components/pageContext';

const sentryEnvironment = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';
const sentryLoaderUrl = process.env.SENTRY_LOADER_URL;

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({
  element,
  props: {pageContext},
}) => (
  <PageContext.Provider value={pageContext}>
    <FeedbackWidgetLoader />
    {element}
  </PageContext.Provider>
);

export const onPreRenderHTML: GatsbySSR['onPreRenderHTML'] = ({getHeadComponents}) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // TODO(epurkhiser): We should figure out if this is actually still necessary
  getHeadComponents().forEach((el: any) => {
    // Remove inline css. https://github.com/gatsbyjs/gatsby/issues/1526
    if (el.type === 'style') {
      el.type = 'link';
      el.props.href = el.props['data-href'];
      el.props.rel = 'stylesheet';
      el.props.type = 'text/css';

      delete el.props['data-href'];
      delete el.props.dangerouslySetInnerHTML;
      delete el.props.children;
    }
  });
};

function SentryLoaderScript() {
  return (
    <script key="sentry-loader-script" src={sentryLoaderUrl} crossOrigin="anonymous" />
  );
}

function SentryLoaderConfig() {
  return (
    <script
      key="sentry-loader-config"
      dangerouslySetInnerHTML={{
        __html: `
Sentry.onLoad(function() {
  Sentry.init({
    integrations: [
      new Sentry.Replay({
        unmask: ['.hover-card-link'],
      }),
    ],
    tracesSampleRate: ${sentryEnvironment === 'development' ? 0 : 1},
    replaysSessionSampleRate: ${sentryEnvironment === 'development' ? 0 : 0.1},
    replaysOnErrorSampleRate: ${sentryEnvironment === 'development' ? 0 : 1},
    networkDetailAllowUrls: ['https://sentry.io/docs/api/*'],
    networkResponseHeaders: [
      'X-Served-By',
      'X-Sentry-Rate-Limit-Limit',
      'X-Sentry-Rate-Limit-Remaining',
      'X-Sentry-Rate-Limit-Reset',
    ],
  });
});`,
      }}
    />
  );
}

export const onRenderBody: GatsbySSR['onRenderBody'] = ({setHeadComponents}) => {
  // Sentry SDK setup
  if (sentryLoaderUrl) {
    setHeadComponents([SentryLoaderScript(), SentryLoaderConfig()]);
  }

  setHeadComponents([
    // Set up the data layer, enable privacy defaults
    <script
      key="gtm-data-layer"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w, l) {
            w[l] = w[l] || [];
            if(/in-app/.test(window.location.pathname)){
              w[l].push({ 'disableDrift': 'true' })
            }
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
          })(window, 'dataLayer');
        `,
      }}
    />,
    // Fetch Tag Manager
    <script
      key="gtm-script"
      src="https://www.googletagmanager.com/gtm.js?id=GTM-N72TJRH"
      async
    />,
  ]);
};
