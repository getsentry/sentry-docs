'use client';

import {Fragment} from 'react';
import styled from '@emotion/styled';

import {Alert} from './alert';

const MetricType = styled.span`
  color: var(--light-text);
  font-style: italic;
`;

function RelayFeatures({features}) {
  if (Array.isArray(features) && features.includes('processing')) {
    return (
      <Alert level="info" title="Note">
        This metric is emitted only when Relay runs as internal Sentry service for event
        ingestion (<code>processing</code> feature).
      </Alert>
    );
  }

  return null;
}

function Metric({metric}) {
  return (
    <Fragment>
      <dt>
        <code>
          {metric.name} <MetricType>({metric.type})</MetricType>
        </code>
      </dt>
      <dd>
        <RelayFeatures features={metric.features} />
        <div
          dangerouslySetInnerHTML={{
            __html: metric.descriptionHtml,
          }}
        />
      </dd>
    </Fragment>
  );
}

type MetricDetail = {
  description: string;
  features: string[];
  name: string;
  type: string;
};
type Props = {
  metrics: MetricDetail[];
};

export function RelayMetricsClient({metrics}: Props) {
  return (
    <dl>
      {metrics.map(metric => (
        <Metric key={metric.name} metric={metric} />
      ))}
    </dl>
  );
}
