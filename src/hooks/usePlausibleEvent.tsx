import {usePlausible} from 'next-plausible';

import {ReadProgressMilestone} from 'sentry-docs/types/plausible';

// Adding custom events here will make them available via the hook
type PlausibleEventProps = {
  ['Copy Expandable Content']: {
    page: string;
    title: string;
  };
  ['Doc Feedback']: {
    helpful: boolean;
    page: string;
  };
  ['Open Expandable']: {
    page: string;
    title: string;
  };
  ['Read Progress']: {
    page: string;
    readProgress: ReadProgressMilestone;
  };
};

/**
 * A hook that provides type-safe access to Plausible Analytics events.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {emit} = usePlausibleEvent();
 *
 *   return (
 *     <button
 *       onClick={() => {
 *         emit('Some Typed Event', {
 *           props: {
 *             page: document.title,
 *           }
 *         });
 *       }}
 *     >
 *       Trigger event
 *     </button>
 *   );
 * }
 * ```
 */

export const usePlausibleEvent = () => {
  const plausible = usePlausible<PlausibleEventProps>();

  return {
    emit: plausible,
  };
};
