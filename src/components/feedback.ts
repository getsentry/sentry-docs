import type {Event} from '@sentry/types';

/**
 * NOTE: These types are still considered Beta and subject to change.
 * @hidden
 */
export interface FeedbackEvent extends Event {
  feedback: {
    contact_email: string;
    message: string;
    replay_id: string;
    // type: 'feedback_event';
    url: string;
  };
}
