export const getAppTypeDefs = () => {
  return [
    `
      type AppFileChecksum {
        name: String!
        value: String!
      }

      type AppFile {
        name: String!
        checksums: [AppFileChecksum!]
      }

      type App implements Node {
        key: String!
        name: String!
        canonical: String!
        url: String
        repoUrl: String!
        version: String!
        files: [AppFile!]
      }
      `,
  ];
};
