'use client';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

type Props = {
  pathname: string;
};

export function DocFeedback({pathname}: Props) {
  const {emit} = usePlausibleEvent();

  const handleFeedback = (helpful: boolean) => {
    emit('Doc Feedback', {props: {page: pathname, helpful}});
  };

  return (
    <div className="flex items-center gap-2 py-4 border-t border-[var(--gray-6)]">
      <span className="text-sm">Was this helpful?</span>
      <button
        onClick={() => handleFeedback(true)}
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
    </div>
  );
}
