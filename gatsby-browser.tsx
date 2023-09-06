import React, {useEffect} from 'react';
import {GatsbyBrowser} from 'gatsby';

import {CodeContextProvider} from 'sentry-docs/components/codeContext';
import {FeedbackWidget} from 'sentry-docs/components/feedbackWidget';
import PageContext from 'sentry-docs/components/pageContext';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props: {pageContext},
}) => {
  useEffect(() => {
    const codeBlock = document.querySelector<HTMLDivElement>('.code-tabs-wrapper');
    if (!codeBlock) {
      return;
    }
    codeBlock.style.position = 'relative';
    codeBlock.style.right = '-74px';
  });
  return (
    <React.Fragment>
      {/* FIXME: we're duplicating CodeContextProvider, which is not nice.
      Ideally, FeedbackWidget is a child of the existing CodeContextProvider. */}
      <CodeContextProvider>
        <FeedbackWidget />
      </CodeContextProvider>
      <PageContext.Provider value={pageContext}>{element}</PageContext.Provider>
    </React.Fragment>
  );
};

// Disable prefetching altogether so our bw is not destroyed.
// If this turns out to hurt performance significantly, we can
// try out https://www.npmjs.com/package/gatsby-plugin-guess-js
// with data from the prior 1-2 weeks.
export const disableCorePrefetching: GatsbyBrowser['disableCorePrefetching'] = () => true;
