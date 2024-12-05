import {Fragment} from 'react';
import {micromark} from 'micromark';

import metrics from 'sentry-docs/data/relay_metrics.json';

import styles from './styles.module.scss';

import {Alert} from '../alert';

export function RelayMetrics() {
  const metricsWithMarkdown = metrics.map(metric => ({
    ...metric,
    descriptionHtml: micromark(metric.description),
  }));
  return (
    <dl>
      {metricsWithMarkdown.map(metric => (
        <Metric key={metric.name} metric={metric} />
      ))}
    </dl>
  );
}

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
        <code className={styles.MetricName}>
          {metric.name} <span className={styles.MetricType}>({metric.type})</span>
        </code>
      </dt>
      <dd className={styles.MetricDescription}>
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
