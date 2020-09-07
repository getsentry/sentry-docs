import metrics from "../../data/relay_metrics.json";

export const relayMetricsNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions;

  metrics.forEach(metric => {
    const descriptionNode = {
      id: createNodeId(metric.name + "_description"),
      internal: {
        content: metric.description,
        contentDigest: createContentDigest(metric.description),
        mediaType: "text/markdown",
        type: "RelayMetricDescription",
      },
    };

    createNode(descriptionNode);

    const metricNode = {
      ...metric,
      id: createNodeId(metric.name),
      internal: {
        type: "RelayMetric",
        contentDigest: createContentDigest(metric),
      },
    };

    createNode(metricNode);

    createParentChildLink({
      parent: metricNode,
      child: descriptionNode,
    });
  });
};
