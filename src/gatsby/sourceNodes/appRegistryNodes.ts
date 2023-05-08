import AppRegistry from '../utils/appRegistry';

export const sourceAppRegistryNodes = async ({actions, createContentDigest}) => {
  const {createNode} = actions;

  const registry = new AppRegistry();
  const allApps = await registry.getList();

  Object.keys(allApps).forEach(async appName => {
    const sdkData = (await registry.getData(appName)) as any;

    const data = {
      canonical: sdkData.canonical,
      name: sdkData.name,
      version: sdkData.version,
      url: sdkData.package_url,
      repoUrl: sdkData.repo_url,
      files: sdkData.files
        ? Object.entries(sdkData.files).map(([fileName, fileData]: [string, any]) =>
            fileData.checksums
              ? {
                  name: fileName,
                  checksums: Object.entries(fileData.checksums).map(([key, value]) => ({
                    name: key,
                    value,
                  })),
                }
              : {}
          )
        : [],
    };

    const content = JSON.stringify(data);
    const nodeMeta = {
      id: appName,
      parent: null,
      children: [],
      internal: {
        type: `App`,
        // mediaType: `text/html`,
        content,
        contentDigest: createContentDigest(data),
      },
    };

    createNode({
      ...data,
      ...nodeMeta,
    });
  });
};
