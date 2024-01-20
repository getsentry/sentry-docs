import {micromark} from 'micromark';
import {RelayMetricsClient} from './relayMetricsClient';
import metrics from 'sentry-docs/data/relay_metrics.json';

export function RelayMetrics() {
  let metricsWithMarkdown = metrics.map(metric => ({
    ...metric,
    descriptionHtml: micromark(metric.description),
  }));
  return <RelayMetricsClient metrics={metricsWithMarkdown} />;
}
