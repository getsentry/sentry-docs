import appRegistry from '../utils/appRegistry';

export const sourceAppRegistryNodes = async ({actions, createContentDigest}) => {
  const {createNode} = actions;

  const allApps = await appRegistry.getList();

  Object.entries(allApps).forEach(([appName, appData]) => {
    const data = {
      canonical: appData.canonical,
      name: appData.name,
      version: appData.version,
      url: appData.package_url,
      repoUrl: appData.repo_url,
      files: appData.files
        ? Object.entries(appData.files).map(([fileName, fileData]: [string, any]) =>
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

    createNode({...data, ...nodeMeta});
  });
};
