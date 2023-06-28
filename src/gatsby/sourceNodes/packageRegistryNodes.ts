import getPackageRegistry from '../utils/packageRegistry';

export const sourcePackageRegistryNodes = async ({actions, createContentDigest}) => {
  const {createNode} = actions;

  const packageRegistry = await getPackageRegistry();
  const allSdks = packageRegistry.data;

  Object.entries(allSdks).forEach(([sdkName, sdkData]) => {
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
      id: sdkName,
      parent: null,
      children: [],
      internal: {
        type: `Package`,
        // mediaType: `text/html`,
        content,
        contentDigest: createContentDigest(data),
      },
    };

    createNode({...data, ...nodeMeta});
  });
};
