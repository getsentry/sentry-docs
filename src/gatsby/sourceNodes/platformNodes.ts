import PlatformRegistry from '../../shared/platformRegistry';

export const sourcePlatformNodes = async ({
  actions,
  reporter,
  createNodeId,
  createContentDigest,
}) => {
  const {createNode} = actions;

  const platformRegistry = new PlatformRegistry();
  await platformRegistry.init();

  platformRegistry.platforms.forEach(platform => {
    reporter.info(`Registering platform ${platform.name}`);
    const content = JSON.stringify(platform);
    const nodeMeta = {
      id: createNodeId(`platform-${platform.key}`),
      parent: null,
      children: [],
      internal: {
        type: `Platform`,
        content,
        contentDigest: createContentDigest(platform),
      },
    };

    createNode({
      ...platform,
      ...nodeMeta,
    });
  });
};
