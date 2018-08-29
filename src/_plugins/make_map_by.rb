module Jekyll
  module MakeMapByFilters
    def make_map_by(input, key)
      rv = {}
      input.each do |item|
        rv[item[key]] = item
      end
      rv
    end
  end
end

Liquid::Template.register_filter(Jekyll::MakeMapByFilters)
