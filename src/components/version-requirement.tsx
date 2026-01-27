import {ReactNode} from 'react';

import {Alert} from './alert';

export type VersionRequirementProps = {
  // e.g., "Sentry React Native SDK"
  minVersion: string;
  product: string;
  // e.g., "Logs for React Native"
  sdk: string;
  children?: ReactNode;
  // e.g., "7.0.0-beta.1"
  level?: 'info' | 'warning' | 'success'; // additional details, upgrade notes, links
};

/**
 * VersionRequirement renders a prominent callout stating the minimum SDK version
 * required for a given feature. It composes the shared Alert/Callout styles and
 * can be reused by any product area (not limited to Logs).
 */
export function VersionRequirement({
  product,
  sdk,
  minVersion,
  level = 'warning',
  children,
}: VersionRequirementProps) {
  return (
    <Alert title="Version requirement" level={level}>
      <p>
        {product} requires {sdk} version <code>{minVersion}</code> or newer.
      </p>
      {children ? <div className="mt-2">{children}</div> : null}
    </Alert>
  );
}
