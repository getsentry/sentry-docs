import React, {Fragment, lazy, Suspense} from 'react';

const FeedbackWidget = lazy(() => import('./feedbackWidget'));

/**
 * Only render FeedbackWidget on client as it needs access to `window`
 */
export function FeedbackWidgetLoader() {
  const isSSR = typeof window === 'undefined';

  return (
    <Fragment>
      {!isSSR && (
        <Suspense fallback={<div />}>
          <FeedbackWidget />
        </Suspense>
      )}
    </Fragment>
  );
}
