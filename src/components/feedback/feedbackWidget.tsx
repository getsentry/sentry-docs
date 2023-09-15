import React, {Fragment, useEffect, useState} from 'react';

import {FeedbackButton} from './feedbackButton';
import {FeedbackModal} from './feedbackModal';
import {FeedbackSuccessMessage} from './feedbackSuccessMessage';
import {sendFeedbackRequest} from './sendFeedbackRequest';

const replay = window.Sentry?.getCurrentHub()
  ?.getClient()
  ?.getIntegration(window.Sentry?.Replay);

interface FeedbackForm {
  comment: string;
  email: string;
  name: string;
}

async function sendFeedback(
  data: FeedbackForm,
  replayId: string,
  pageUrl: string
): Promise<Response | null> {
  const feedback = {
    message: data.comment,
    email: data.email,
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

  const handleSubmit = (data: FeedbackForm) => {
    // Prepare session replay
    replay?.flush();
    const replayId = replay?.getReplayId();

    const pageUrl = document.location.href;

    sendFeedback(data, replayId, pageUrl).then(response => {
      if (response) {
        setOpen(false);
        setShowSuccessMessage(true);
      } else {
        // eslint-disable-next-line no-alert
        alert('Error submitting your feedback. Please try again');
      }
    });
  };

  return (
    <Fragment>
      {!open && <FeedbackButton onClick={() => setOpen(true)} />}
      <FeedbackModal open={open} onSubmit={handleSubmit} onClose={() => setOpen(false)} />
      <FeedbackSuccessMessage show={showSuccessMessage} />
    </Fragment>
  );
}
