import React from "react";
import styled from "@emotion/styled";
import { graphql, useStaticQuery } from "gatsby";
import Alert from "~src/components/alert";

const query = graphql`
  query RelayMetricsQuery {
    allRelayMetric {
      nodes {
        name
        type
        features

        childrenRelayMetricDescription {
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
  if (Array.isArray(features) && features.includes("processing")) {
    return (
      <Alert level="info" title="Note">
        This metric is emitted only when Relay runs as internal Sentry service
        for event ingestion (<code>processing</code> feature).
      </Alert>
    );
  }

  return null;
}

function Metric({ metric }) {
  const descriptionHtml =
    metric.childrenRelayMetricDescription[0].childMarkdownRemark.html;

  return (
    <>
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
    </>
  );
}

export default (): JSX.Element => {
  const data = useStaticQuery(query);
  const metrics = data.allRelayMetric.nodes;

  return (
    <dl>
      {metrics.map(metric => (
        <Metric key={metric.name} metric={metric} />
      ))}
    </dl>
  );
};
