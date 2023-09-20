import React from 'react';
import {GatsbyBrowser} from 'gatsby';

import {FeedbackWidgetLoader} from 'sentry-docs/components/feedback/feedbackWidgetLoader';
import PageContext from 'sentry-docs/components/pageContext';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props: {pageContext},
}) => <PageContext.Provider value={pageContext}>
        <FeedbackWidgetLoader />
        {element}
    </PageContext.Provider>

// Disable prefetching altogether so our bw is not destroyed.
// If this turns out to hurt performance significantly, we can
// try out https://www.npmjs.com/package/gatsby-plugin-guess-js
// with data from the prior 1-2 weeks.
export const disableCorePrefetching: GatsbyBrowser['disableCorePrefetching'] = () => true;
