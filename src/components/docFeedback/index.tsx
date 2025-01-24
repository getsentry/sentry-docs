'use client';
import {Fragment, useEffect, useState} from 'react';
import {CheckIcon as Check} from '@radix-ui/react-icons';
import * as Sentry from '@sentry/browser';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import {Modal} from '../modal';

type Props = {
  pathname: string;
};

export function DocFeedback({pathname}: Props) {
  const {emit} = usePlausibleEvent();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Initialize feedback state from sessionStorage
  useEffect(() => {
    const storedFeedback = sessionStorage.getItem(`feedback_${pathname}`);
    if (storedFeedback === 'submitted') {
      setFeedbackSubmitted(true);
    }
  }, [pathname]);

  // Auto-close modal after feedback submission
  useEffect(() => {
    if (feedbackSubmitted && showFeedbackModal) {
      const timer = setTimeout(() => {
        setShowFeedbackModal(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedbackSubmitted, showFeedbackModal]);

  const handleFeedback = (helpful: boolean) => {
    emit('Doc Feedback', {props: {page: pathname, helpful}});

    if (helpful) {
      setFeedbackSubmitted(true);
      sessionStorage.setItem(`feedback_${pathname}`, 'submitted');
    } else {
      setShowFeedbackModal(true);
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comments = formData.get('comments') as string;

    try {
      Sentry.captureFeedback(
        {message: comments},
        {captureContext: {tags: {page: pathname}}}
      );
      setFeedbackSubmitted(true);
      sessionStorage.setItem(`feedback_${pathname}`, 'submitted');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <Fragment>
      <div className="flex items-center gap-2 py-4 border-t border-[var(--gray-6)]">
        {feedbackSubmitted ? (
          <div className="flex items-center gap-2 text-sm text-[var(--gray-11)]">
            <Check className="w-4 h-4" /> Thanks for your feedback
          </div>
        ) : (
          <Fragment>
            <span className="text-sm">Was this helpful?</span>
            <button
              onClick={() => {
                handleFeedback(true);
              }}
              className="py-2 px-4 gap-4 hover:bg-[var(--gray-3)] rounded-full flex items-center justify-center"
              aria-label="Yes, this was helpful"
            >
              Yes 👍
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="py-2 px-4 gap-4 hover:bg-[var(--gray-3)] rounded-full flex items-center justify-center"
              aria-label="No, this wasn't helpful"
            >
              No 👎
            </button>
          </Fragment>
        )}
      </div>

      <Modal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setFeedbackSubmitted(false);
        }}
        title={feedbackSubmitted ? 'Thanks for your feedback!' : 'Help us improve'}
      >
        {feedbackSubmitted ? (
          <div className="text-center">
            <p className="text-[var(--gray-11)] p-0 m-0">
              We appreciate your help in making our documentation better.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <p className="text-[var(--gray-11)] p-0 m-0">
              We'd love to hear more about how we can improve this page. Your feedback
              helps us make our documentation better for everyone.
            </p>
            <div>
              <label htmlFor="comments" className="block text-sm font-medium mb-4">
                What could we improve?
              </label>
              <textarea
                id="comments"
                name="comments"
                required
                rows={4}
                className="w-full px-3 py-2 border border-[var(--gray-6)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-transparent"
                placeholder="Please share your suggestions..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-sm hover:bg-[var(--gray-3)] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[var(--accent-purple)] rounded-lg"
              >
                Submit feedback
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Fragment>
  );
}
