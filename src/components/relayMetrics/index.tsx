import {micromark} from 'micromark';
import {Fragment} from 'react';
import metrics from 'sentry-docs/data/relay_metrics.json';

import {Alert} from '../alert';
import styles from './styles.module.scss';

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
      <Alert title="Note">
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
