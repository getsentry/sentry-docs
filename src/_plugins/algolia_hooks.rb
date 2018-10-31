module Jekyll
  module Algolia
    module Hooks

      # Exclude certain frontmatter keys form indexing
      def self.before_indexing_each(record, node, context)
        [
          :sidebar_order,
          :collection,
          :slug,
          :type,
          :url,
          :permalink,
          :api_path,
          :authentication,
          :example_request,
          :example_response,
          :method,
          :parameters,
          :path_parameters,
          :query_parameters,
          :warning,
        ].each do |key|
          record.delete(key)
        end
        record
      end

    end
  end
end
