import React, {lazy} from 'react';

const FeedbackWidget = lazy(() => import('./feedbackWidget'));

/**
 * Only render FeedbackWidget on client as it needs access to `window`
 */
export function FeedbackWidgetLoader() {
  const isSSR = typeof window === 'undefined';

  return (
    <React.Fragment>
      {!isSSR && (
        <React.Suspense fallback={<div />}>
          <FeedbackWidget />
        </React.Suspense>
      )}
    </React.Fragment>
  );
}
