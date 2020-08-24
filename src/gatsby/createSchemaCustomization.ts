// TODO(dcramer): move frontmatter out of ApiDoc and into Frontmatter
export default ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type PageContext {
      title: String
      sidebar_order: Int
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

    type ApiParam {
      type: String!
      name: String!
      description: String
    }

    type ApiDoc implements Node {
      sidebar_order: Int
      title: String!
      fields: Fields

      api_path: String!
      authentication:  String
      description: String
      example_request: String
      example_response: String
      method: String!
      parameters: [ApiParam]
      path_parameters: [ApiParam]
      query_parameters: [ApiParam]
      warning: String
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
  createTypes(typeDefs);
};
