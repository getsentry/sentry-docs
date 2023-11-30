export const getPlatformTypeDefs = () => {
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
      sdk: String
      caseStyle: PlatformCaseStyle!
      supportLevel: PlatformSupportLevel!
      categories: [PlatformCategory!]
      url: String!
      fallbackPlatform: String!
      icon: String
    }

    type Platform implements Node {
      key: String!
      name: String!
      title: String!
      sdk: String
      caseStyle: PlatformCaseStyle!
      supportLevel: PlatformSupportLevel!
      guides: [PlatformGuide!]
      categories: [PlatformCategory!]
      url: String!
      fallbackPlatform: String
      icon: String
    }
    `,
  ];
};
