import React from 'react';
import * as Sentry from '@sentry/browser';

import {FeebdackButton} from './feedbackButton';
import {FeedbackModal} from './feedbackModal';

Sentry.init({
  // https://sentry-test.sentry.io/issues/?project=4505742647754752
  dsn: 'https://db1366bd2d586cac50181e3eaee5c3e1@o19635.ingest.sentry.io/4505742647754752',
});

function getGitHubSourcePage(): string {
  const xpath = "//a[text()='Suggest an edit to this page']";
  const matchingElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as HTMLAnchorElement;
  return matchingElement === null ? '' : matchingElement.href;
}

export function FeebdackWidget() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: {comment: string; title: string; image?: Blob}) => {
    console.log(data);
    setOpen(false);

    let eventId: string;
    const imageBlob: Uint8Array = Uint8Array.from('', c => c.charCodeAt(0));

    Sentry.withScope(scope => {
      scope.addAttachment({
        filename: 'screenshot.png',
        data: imageBlob,
        contentType: 'image/png',
      });

      // We don't need breadcrumbs for now
      scope.clearBreadcrumbs();

      const sourcePage = getGitHubSourcePage();
      console.log('GitHub source page:', sourcePage);
      if (sourcePage) {
        scope.setContext('Edit Content', {
          'Source file': sourcePage,
        });
      }

      eventId = Sentry.captureMessage(data.title);
    });

    const userFeedback = {
      name: 'fixme name',
      email: 'test@test.com',
      comments: `${data.title}: ${data.comment}`,
      event_id: eventId,
    };
    Sentry.captureUserFeedback(userFeedback);
  };

  return (
    <React.Fragment>
      {!open && <FeebdackButton onClick={() => setOpen(true)} />}
      <FeedbackModal open={open} onSubmit={handleSubmit} onClose={() => setOpen(false)} />
    </React.Fragment>
  );
}
