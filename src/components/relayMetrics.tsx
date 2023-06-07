import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import { graphql, useStaticQuery } from 'gatsby';

import {Alert} from './alert';

const query = graphql`
  query RelayMetricsQuery {
    allRelayMetric {
      nodes {
        name
        type
        features

        childRelayMetricDescription {
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`;

const MetricType = styled.span`
  color: var(--light-text);
  font-style: italic;
`;

function RelayFeatures({ features }) {
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

function Metric({ metric }) {
  const descriptionHtml = metric.childRelayMetricDescription.childMarkdownRemark.html;

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
            __html: descriptionHtml,
          }}
        />
      </dd>
    </Fragment>
  );
}

export function RelayMetrics(): JSX.Element {
  const data = useStaticQuery(query);
  const metrics = data.allRelayMetric.nodes;

  return (
    <dl>
      {metrics.map(metric => (
        <Metric key={metric.name} metric={metric} />
      ))}
    </dl>
  );
}
