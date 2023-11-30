import {SourceNodesArgs} from 'gatsby';

import {buildPlatformRegistry} from '../../shared/platformRegistry';

export const sourcePlatformNodes = async ({
  actions,
  reporter,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const {createNode} = actions;

  const {platforms} = await buildPlatformRegistry();

  platforms.forEach(platform => {
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
