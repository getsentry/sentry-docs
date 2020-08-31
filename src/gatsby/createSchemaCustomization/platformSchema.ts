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
      community
    }

    enum PlatformCategory {
      browser
      desktop
      mobile
      server
      serverless
    }

    type PlatformGuide {
      key: String!
      name: String!
      title: String!
      caseStyle: PlatformCaseStyle!
      supportLevel: PlatformSupportLevel!
      categories: [PlatformCategory!]
      url: String!
      fallbackPlatform: String!
    }

    type Platform implements Node {
      key: String!
      name: String!
      title: String!
      caseStyle: PlatformCaseStyle!
      supportLevel: PlatformSupportLevel!
      guides: [PlatformGuide!]
      categories: [PlatformCategory!]
      url: String!
    }
    `,
  ];
};
