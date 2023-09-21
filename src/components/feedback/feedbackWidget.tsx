import React from 'react';

import {FeedbackButton} from './feedbackButton';
import {FeedbackModal} from './feedbackModal';

interface FeedbackWidgetProps {
  title?: string;
}

/**
 * The "Widget" connects the default Feedback button with the Feedback Modal
 */
export default function FeedbackWidget({title = 'Report a Bug'}: FeedbackWidgetProps) {
  // Don't render anything if Sentry is not already loaded
  if (!window.Sentry?.getCurrentHub?.()) {
    return null;
  }

  return (
    <FeedbackModal title={title}>
      {({open, showModal}) => (open ? null : <FeedbackButton onClick={showModal} />)}
    </FeedbackModal>
  );
}
