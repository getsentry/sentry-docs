module Jekyll
  module StripCodeFilter
    def strip_code(input)
      input.gsub(/\<(pre|code)[\s\S]+?(\1)\>/, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::StripCodeFilter)
