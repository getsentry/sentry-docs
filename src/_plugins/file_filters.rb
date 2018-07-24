module Jekyll
  module FileFilters

    def file_slug(input)
      return input if input.nil?

      input.split("/").last().split(".").first()
    end

    def file_name(input)
      return if input.nil?

      input.split("/").last()
    end

  end
end

Liquid::Template.register_filter(Jekyll::FileFilters)
