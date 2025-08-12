import {ReactNode} from 'react';

import {Alert} from './alert';

export type VersionRequirementProps = {
  product: string; // e.g., "Logs for React Native"
  sdk: string; // e.g., "Sentry React Native SDK"
  minVersion: string; // e.g., "7.0.0-beta.1"
  level?: 'info' | 'warning' | 'success';
  children?: ReactNode; // additional details, upgrade notes, links
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
      {product} requires {sdk} version `{minVersion}` or newer.
      {children ? <div className="mt-2">{children}</div> : null}
    </Alert>
  );
}