import React, {useEffect} from 'react';
import {GatsbyBrowser} from 'gatsby';

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
    <PageContext.Provider value={pageContext}>
      <React.Fragment>
        <FeedbackWidget />
        {element}
      </React.Fragment>
    </PageContext.Provider>
  );
};

// Disable prefetching altogether so our bw is not destroyed.
// If this turns out to hurt performance significantly, we can
// try out https://www.npmjs.com/package/gatsby-plugin-guess-js
// with data from the prior 1-2 weeks.
export const disableCorePrefetching: GatsbyBrowser['disableCorePrefetching'] = () => true;
