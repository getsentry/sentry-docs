import metrics from '../../data/relay_metrics.json';

export const relayMetricsNodes = ({actions, createNodeId, createContentDigest}) => {
  const {createNode, createParentChildLink} = actions;

  metrics.forEach(metric => {
    const metricNode = {
      ...metric,
      id: createNodeId(metric.name),
      internal: {
        type: 'RelayMetric',
        contentDigest: createContentDigest(metric),
      },
    };

    createNode(metricNode);

    const descriptionNode = {
      id: createNodeId(metric.name + '_description'),
      parent: metricNode.id,
      internal: {
        content: metric.description,
        contentDigest: createContentDigest(metric.description),
        mediaType: 'text/markdown',
        type: 'RelayMetricDescription',
      },
    };

    createNode(descriptionNode);

    createParentChildLink({
      parent: metricNode,
      child: descriptionNode,
    });
  });
};
