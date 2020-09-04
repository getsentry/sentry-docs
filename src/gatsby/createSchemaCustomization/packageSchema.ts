export const getPackageTypeDefs = () => {
  return [
    `
      type PackageFileChecksum {
        name: String!
        value: String!
      }

      type PackageFile {
        name: String!
        checksums: [PackageFileChecksum!]
      }

      type Package implements Node {
        key: String!
        name: String!
        canonical: String!
        url: String
        repoUrl: String!
        version: String!
        files: [PackageFile!]
      }
      `,
  ];
};
