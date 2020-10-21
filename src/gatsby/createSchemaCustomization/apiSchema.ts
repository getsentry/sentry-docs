export const getApiTypeDefs = () => {
  return [
    `
      type ApiParam {
        type: String!
        name: String!
        description: String
      }

      type ApiEndpoint implements Node {
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
      
      type ApiParameterSchema {
        enum: [String]
        format: String
        type: String
      }
      
      type openApiPathDescription implements Node @childOf(types: ["openAPI"], ) {
        id: ID!
      }
      
      type openApiPathParameter implements Node @childOf(types: ["openAPI"], many: true) {
        id: ID!
        schema: ApiParameterSchema
        name: String
        in: String
        description: String
        required: Boolean
      }
      
      type Mdx implements Node @childOf(types: ["openApiPathDescription", "openApiPathParameter"], mimeTypes: ["text/markdown"]) {
        body: String
      }
      `,
  ];
};
