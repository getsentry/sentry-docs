import type {ReactNode} from 'react';
import {Fragment} from 'react';

import {ExternalLink} from './externalLink';

type FeatureKey =
  | 'issues'
  | 'tracing'
  | 'sessionReplay'
  | 'logs'
  | 'profiling'
  | 'userFeedback'
  | 'metrics';

const FEATURE_DATA: Record<
  FeatureKey,
  {
    findInSentry: ReactNode;
    learnMore: ReactNode;
    link: string;
    title: string;
  }
> = {
  issues: {
    title: 'Issues',
    link: '/product/issues',
    learnMore:
      "Sentry's core error monitoring product that automatically reports errors, uncaught exceptions, and unhandled rejections. If you have something that looks like an exception, Sentry can capture it.",
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/issues/">
          <strong>Issues</strong>
        </ExternalLink>{' '}
        page and select an error from the issues list to view the full details and context
        of this error. For more details, see this{' '}
        <a href="/product/sentry-basics/integrate-frontend/generate-first-error/#ui-walkthrough">
          interactive walkthrough
        </a>
        .
      </Fragment>
    ),
  },
  tracing: {
    title: 'Tracing',
    link: '/product/tracing',
    learnMore:
      'Track software performance while seeing the impact of errors across multiple systems. For example, distributed tracing allows you to follow a request from the frontend to the backend and back.',
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/explore/traces/">
          <strong>Traces</strong>
        </ExternalLink>{' '}
        page and select a trace to reveal more information about each span, its duration,
        and any errors. For an interactive UI walkthrough, click{' '}
        <a href="/product/sentry-basics/distributed-tracing/generate-first-error/#ui-walkthrough">
          here
        </a>
        .
      </Fragment>
    ),
  },
  sessionReplay: {
    title: 'Session Replay',
    link: '/product/explore/session-replay/web',
    learnMore:
      "Get to the root cause of an issue faster by viewing a video-like reproduction of what was happening in the user's browser before, during, and after the problem.",
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/replays/">
          <strong>Replays</strong>
        </ExternalLink>{' '}
        page and select an entry from the list to get a detailed view where you can replay
        the interaction and get more information to help you troubleshoot.
      </Fragment>
    ),
  },
  logs: {
    title: 'Logs',
    link: '/product/explore/logs',
    learnMore:
      "Centralize and analyze your application logs to correlate them with errors and performance issues. Search, filter, and visualize log data to understand what's happening in your applications.",
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/explore/logs/">
          <strong>Logs</strong>
        </ExternalLink>{' '}
        page and filter by service, environment, or search keywords to view log entries
        from your application. For an interactive UI walkthrough, click{' '}
        <a href="/product/explore/logs/#overview">here</a>.
      </Fragment>
    ),
  },
  profiling: {
    title: 'Profiling',
    link: '/product/explore/profiling/',
    learnMore:
      'Gain deeper insight than traditional tracing without custom instrumentation, letting you discover slow-to-execute or resource-intensive functions in your app.',
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/profiling/">
          <strong>Profiles</strong>
        </ExternalLink>{' '}
        page, select a transaction, and then a profile ID to view its flame graph. For
        more information, click{' '}
        <a href="/product/explore/profiling/profile-details/">here</a>.
      </Fragment>
    ),
  },
  userFeedback: {
    title: 'User Feedback',
    link: '/product/user-feedback',
    learnMore:
      'Collect feedback directly from users when they encounter errors, allowing them to describe what happened and provide context that helps you understand and resolve issues faster.',
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/feedback/">
          <strong>User Feedback</strong>
        </ExternalLink>{' '}
        page and click on individual feedback to see more details all in one view. For
        more information, click <a href="/product/user-feedback/">here</a>.
      </Fragment>
    ),
  },
  metrics: {
    title: 'Application Metrics',
    link: '/product/explore/metrics',
    learnMore:
      "Track and analyze custom application metrics, such as response times and database query durations, to understand trends and patterns in your application's performance and behavior over time.",
    findInSentry: (
      <Fragment>
        Open the{' '}
        <ExternalLink href="https://sentry.io/orgredirect/organizations/:orgslug/explore/metrics">
          <strong>Application Metrics</strong>
        </ExternalLink>{' '}
        page to view and analyze your metrics. For more details, see this{' '}
        <a href="/product/explore/metrics/#overview">interactive walkthrough</a>.
      </Fragment>
    ),
  },
};

type FeatureInfoProps = {
  features: FeatureKey[];
  type: 'learnMore' | 'findInSentry';
};

/**
 * FeatureInfo displays information about Sentry features in list format.
 * For example, we use it in our quick start guides to show helpful information about features
 *
 * @param features - Array of feature keys to display
 * @param type - learnMore shows feature descriptions, findInSentry shows navigation help
 */
export function FeatureInfo({features, type}: FeatureInfoProps) {
  return (
    <ul>
      {features.map(key => {
        const feature = FEATURE_DATA[key];

        if (type === 'learnMore') {
          return (
            <li key={key}>
              <a href={feature.link}>
                <strong>{feature.title}</strong>
              </a>
              {key === 'issues' && ' (always enabled)'}: {feature.learnMore}
            </li>
          );
        }

        return <li key={key}>{feature.findInSentry}</li>;
      })}
    </ul>
  );
}
