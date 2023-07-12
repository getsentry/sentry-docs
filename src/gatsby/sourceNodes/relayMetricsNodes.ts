import {Node, SourceNodesArgs} from 'gatsby';

import metrics from '../../data/relay_metrics.json';

export const relayMetricsNodes = ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const {createNode, createParentChildLink} = actions;

  metrics.forEach(metric => {
    const metricNode: Node = {
      ...metric,
      id: createNodeId(metric.name),
      // @ts-expect-error TODO(epurkhiser): Understand what additional properties we need to add
      internal: {
        type: 'RelayMetric',
        contentDigest: createContentDigest(metric),
      },
    };

    createNode(metricNode);

    const descriptionNode: Node = {
      id: createNodeId(metric.name + '_description'),
      parent: metricNode.id,
      // @ts-expect-error TODO(epurkhiser): Understand what additional properties we need to add
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
