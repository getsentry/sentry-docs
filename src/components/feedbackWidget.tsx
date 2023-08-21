import React, {useCallback, useEffect} from 'react';
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

  const handleSubmit = async (data: {comment: string; title: string; image?: Blob}) => {
    console.log('handleSubmit data:', data);
    setOpen(false);

    let eventId: string;
    let imageBlob: Uint8Array = null;

    if (data.image && data.image.size > 0) {
      const blobData = await data.image.arrayBuffer();
      console.log('blobdata:', blobData);
      imageBlob = new Uint8Array(blobData);
    }

    Sentry.withScope(scope => {
      // We don't need breadcrumbs for now
      scope.clearBreadcrumbs();

      if (imageBlob) {
        scope.addAttachment({
          filename: 'screenshot.png',
          data: imageBlob,
          contentType: 'image/png',
        });
      }

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

  const handleKeyPress = useCallback(event => {
    // Shift+Enter
    if (event.shiftKey && event.keyCode === 13) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <React.Fragment>
      {!open && <FeebdackButton onClick={() => setOpen(true)} />}
      <FeedbackModal open={open} onSubmit={handleSubmit} onClose={() => setOpen(false)} />
    </React.Fragment>
  );
}
