module Jekyll
  module LiquifyFilter
    def url_starts_with(input, arg)
      arg = arg.chomp('/')
      prefix = input[0..arg.length]
      prefix == arg || prefix == arg + '/'
    end
  end
end

Liquid::Template.register_filter(Jekyll::LiquifyFilter)
