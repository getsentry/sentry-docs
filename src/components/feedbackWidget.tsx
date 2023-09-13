import React, {useCallback, useEffect, useState} from 'react';
import * as Sentry from '@sentry/browser';

import {FeedbackButton} from './feedbackButton';
import {FeedbackModal} from './feedbackModal';
import {FeedbackSuccessMessage} from './feedbackSuccessMessage';
import {sendFeedbackRequest} from './sendFeedbackRequest';

const replay = new Sentry.Replay();
Sentry.init({
  dsn: 'https://db1366bd2d586cac50181e3eaee5c3e1@o19635.ingest.sentry.io/4505742647754752',
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [replay],
  debug: true,
});

async function sendFeedback(data, replayId, pageUrl): Promise<Response | null> {
  const feedback = {
    message: data.comment,
    email: data.email,
    name: data.name,
    replay_id: replayId,
    url: pageUrl,
  };
  const response = await sendFeedbackRequest(feedback);
  return response;
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
    // Prepare session replay
    replay.flush();
    const replayId = replay.getReplayId();

    const pageUrl = document.location.href;

    sendFeedback(data, replayId, pageUrl).then(response => {
      if (response) {
        setOpen(false);
        setShowSuccessMessage(true);
      } else {
        alert('Error submitting your feedback. Please try again');
      }
    });
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
