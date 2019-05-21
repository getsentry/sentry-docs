module Jekyll
  module Algolia
    module Hooks
      def self.before_indexing_all(records, context)
        platforms = Hash[context.data["platform_icons"].collect { |item| [item["link"].split('/', 4)[2], item["name"]] }]
        doc_categories = Hash[context.data["documentation_categories"].collect { |item| [item["slug"], item["title"]] }]
              
        records.each do |record|
          # Exclude certain frontmatter keys form indexing
          [
            :sidebar_order,
            :collection,
            :slug,
            :type,
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
          # dynamically tag the language category
          if record[:url].match(/^\/platforms\//)
            platform = platforms[record[:url].split('/', 4)[2]]
            unless platform.nil?
              record[:categories] |= []
              record[:categories].push platform
            end
          else
            doc_root = doc_categories[record[:url].split('/', 3)[1]]
            unless doc_root.nil? || doc_root == "Home"
              record[:categories] |= []
              record[:categories].push doc_root
            end
          end
        end
        records
      end

    end
  end
end
