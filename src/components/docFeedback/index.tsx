'use client';
import {Fragment, useEffect, useState} from 'react';
import {CheckIcon as Check} from '@radix-ui/react-icons';
import {Button} from '@radix-ui/themes';
import * as Sentry from '@sentry/browser';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

type Props = {
  pathname: string;
};

export function DocFeedback({pathname}: Props) {
  const {emit} = usePlausibleEvent();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'helpful' | 'not_helpful' | null>(
    null
  );

  // Initialize feedback state from sessionStorage
  useEffect(() => {
    const storedFeedback = sessionStorage.getItem(`feedback_${pathname}`);
    if (storedFeedback === 'submitted') {
      setFeedbackSubmitted(true);
    }
  }, [pathname]);

  const handleFeedback = (helpful: boolean) => {
    emit('Doc Feedback', {props: {page: pathname, helpful}});
    setFeedbackType(helpful ? 'helpful' : 'not_helpful');
    setShowFeedback(true);
  };

  const handleSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comments = formData.get('comments') as string;

    try {
      Sentry.captureFeedback(
        {
          message: comments,
        },
        {captureContext: {tags: {page: pathname, type: feedbackType}}}
      );
      setFeedbackSubmitted(true);
      sessionStorage.setItem(`feedback_${pathname}`, 'submitted');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Failed to submit feedback:', error);
      }
      Sentry.captureException(error);
    }
  };

  return (
    <Fragment>
      <div className="space-y-4 py-4 border-[var(--gray-6)]">
        {feedbackSubmitted ? (
          <div className="flex items-center gap-2 text-sm text-[var(--gray-11)]">
            <Check className="w-4 h-4" /> Thanks for your feedback
          </div>
        ) : (
          <Fragment>
            <div className="flex items-center gap-4 text-sm mt-8">
              <span className="font-medium">Was this helpful?</span>
              <div className="flex">
                <button
                  onClick={() => handleFeedback(true)}
                  className="py-1 px-2 gap-4 hover:bg-[var(--gray-3)] rounded flex items-center justify-center"
                  aria-label="Yes, this was helpful"
                >
                  Yes 👍
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="py-1 px-2 gap-4 hover:bg-[var(--gray-3)] rounded flex items-center justify-center"
                  aria-label="No, this wasn't helpful"
                >
                  No 👎
                </button>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showFeedback ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium mb-4">
                    {feedbackType === 'helpful'
                      ? 'What did you like about this page?'
                      : 'How can we improve this page?'}
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    required
                    rows={2}
                    className="w-[calc(100%-4px)] ml-[2px] px-3 py-2 border border-[var(--gray-6)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-transparent text-sm"
                    placeholder="Please share your thoughts..."
                  />
                </div>
                <Button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-purple)]"
                  size={'3'}
                >
                  Submit feedback
                </Button>
              </form>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
