import PackageRegistry from "../utils/packageRegistry";

export const sourcePackageRegistryNodes = async ({
  actions,
  createContentDigest,
}) => {
  const { createNode } = actions;

  const registry = new PackageRegistry();
  const allSdks = await registry.getList();

  Object.keys(allSdks).forEach(async sdkName => {
    const sdkData = (await registry.getData(sdkName)) as any;

    const data = {
      canonical: sdkData.canonical,
      name: sdkData.name,
      version: sdkData.version,
      url: sdkData.package_url,
      repoUrl: sdkData.repo_url,
      files: sdkData.files
        ? Object.entries(sdkData.files).map(
          ([fileName, fileData]: [string, any]) => (
            fileData.checksums ? {
              name: fileName,
              checksums: Object.entries(fileData.checksums).map(
                ([key, value]) => ({
                  name: key,
                  value: value,
                })
              ),
            } : {} )
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

    createNode({
      ...data,
      ...nodeMeta,
    });
  });
};
