import { getApiTypeDefs } from "./apiSchema";
import { getPlatformTypeDefs } from "./platformSchema";
import { getPackageTypeDefs } from "./packageSchema";

// TODO(dcramer): move frontmatter out of ApiEndpoint and into Frontmatter
export default ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type PageContext {
      title: String
      sidebar_order: Int
      sidebar_title: String
      draft: Boolean
      redirect_from: [String!]

      platform: PlatformContext
      guide: GuideContext
    }

    type PlatformContext {
      name: String!
      title: String!
    }

    type GuideContext {
      name: String!
      title: String!
    }

    type SitePage implements Node {
      context: PageContext
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Fields {
      slug: String!
      legacy: Boolean
    }
  `,
    schema.buildObjectType({
      name: "Frontmatter",
      fields: {
        title: {
          type: "String!",
        },
        keywords: {
          type: "[String!]",
        },
        draft: {
          type: "Boolean",
        },
        redirect_from: {
          type: "[String!]",
        },
        noindex: {
          type: "Boolean",
        },
        sidebar_title: {
          type: "String",
        },
        sidebar_order: {
          type: "Int",
          resolve(source, _args, _context, info) {
            // For a more generic solution, you could pick the field value from
            // `source[info.fieldName]`
            return source[info.fieldName] !== null
              ? source[info.fieldName]
              : 10;
          },
        },

        // platform pages
        supported: {
          type: "[String!]",
        },
        notSupported: {
          type: "[String!]",
        },

        // wizard fields
        // TODO(dcramer): move to a diff schema/type
        support_level: {
          type: "String",
        },
        type: {
          type: "String",
        },
        doc_link: {
          type: "String",
        },
        name: {
          type: "String",
        },
      },
    }),
  ];
  createTypes([
    ...typeDefs,
    ...getApiTypeDefs(),
    ...getPlatformTypeDefs(),
    ...getPackageTypeDefs(),
  ]);
};
