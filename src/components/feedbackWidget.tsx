import React, {useCallback, useEffect, useState} from 'react';
import * as Sentry from '@sentry/browser';

import {FeedbackButton} from './feedbackButton';
import {FeedbackModal} from './feedbackModal';
import {FeedbackSuccessMessage} from './feedbackSuccessMessage';

const replay = new Sentry.Replay();
Sentry.init({
  // https://sentry-test.sentry.io/issues/?project=4505742647754752
  dsn: 'https://db1366bd2d586cac50181e3eaee5c3e1@o19635.ingest.sentry.io/4505742647754752',
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [replay],
  debug: true,
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

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!showSuccessMessage) {
      return () => {};
    }
    const timeout = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 6000);
    return () => {
      clearTimeout(timeout);
    };
  }, [showSuccessMessage]);

  const handleSubmit = (data: {comment: string; email: string; name: string}) => {
    let nearestHeadingElement: HTMLElement;
    let nearestIdInViewport: string;

    let eventId: string;

    Sentry.withScope(scope => {
      const contentContext: any = {};
      const sourcePage = getGitHubSourcePage();
      if (sourcePage) {
        contentContext['Edit file'] = sourcePage;
        contentContext.Repository = sourcePage.split('/').slice(0, 5).join('/');
      }

      const pageTitle = document.title;
      if (pageTitle) {
        scope.setTag('page_title', pageTitle);
        contentContext['Page title'] = pageTitle;
      }

      if (nearestHeadingElement && nearestHeadingElement.textContent) {
        const pageSection = nearestHeadingElement.textContent;
        scope.setTag('page_section', pageSection);
        contentContext['Page section'] = pageSection;
      }

      if (nearestIdInViewport) {
        const currentUrl = new URL(document.location.href);
        currentUrl.hash = nearestIdInViewport;
        const elementUrl = currentUrl.toString();
        scope.setTag('element_url', elementUrl);
        contentContext['Element URL'] = elementUrl;
      }

      // Prepare session replay
      replay.flush();
      const replayId = replay.getReplayId();
      if (replayId) {
        scope.setTag('replayId', replayId);
      }

      if (contentContext) {
        scope.setContext('Content', contentContext);
      }

      // We don't need breadcrumbs for now
      scope.clearBreadcrumbs();
      eventId = Sentry.captureMessage(data.comment);
    });

    const userFeedback = {
      name: data.name || 'Anonymous',
      email: data.email,
      comments: data.comment,
      event_id: eventId,
    };
    Sentry.captureUserFeedback(userFeedback);
    setOpen(false);
    setShowSuccessMessage(true);
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
      {!open && <FeedbackButton onClick={() => setOpen(true)} />}
      <FeedbackModal open={open} onSubmit={handleSubmit} onClose={() => setOpen(false)} />
      <FeedbackSuccessMessage show={showSuccessMessage} />
    </React.Fragment>
  );
}
