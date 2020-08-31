export const getPlatformTypeDefs = ({ actions, schema }) => {
  return [
    `
    enum PlatformCaseStyle {
      canonical
      camelCase
      PascalCase
      snake_case
    }

    enum PlatformSupportLevel {
      production
    }


    type Guide {
      name: String!
      title: String!
      caseStyle: PlatformCaseStyle!
      supportLevel: PlatformSupportLevel!
      url: String!
    }

    type Platform implements Node {
      name: String!
      title: String!
      caseStyle: PlatformCaseStyle!
      supportLevel: PlatformSupportLevel!
      guides: [Guide!]
      url: String!
    }
    `,
  ];
};
