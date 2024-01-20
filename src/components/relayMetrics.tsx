import {micromark} from 'micromark';

import metrics from 'sentry-docs/data/relay_metrics.json';

import {RelayMetricsClient} from './relayMetricsClient';

export function RelayMetrics() {
  const metricsWithMarkdown = metrics.map(metric => ({
    ...metric,
    descriptionHtml: micromark(metric.description),
  }));
  return <RelayMetricsClient metrics={metricsWithMarkdown} />;
}
