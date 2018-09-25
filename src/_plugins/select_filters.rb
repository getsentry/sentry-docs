module Jekyll
  module SelectFilters
    def map_select(input, arg)
      keys = arg.split(/\s*,\s*/)
      input.map do |x|
        x.select { |k| keys.include? k.to_s }
      end
    end

    def select(input, arg)
      keys = arg.split(/\s*,\s*/)
      input.select { |k| keys.include? k.to_s }
    end
  end
end

Liquid::Template.register_filter(Jekyll::SelectFilters)
