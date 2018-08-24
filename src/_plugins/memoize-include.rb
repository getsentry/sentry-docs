# Copied from https://github.com/Blu-J/jekyll-memoize-include
module Jekyll
  class MemInclude < Jekyll::Tags::IncludeTag

    def initialize(tag_name, markup, options)
      super
      @key = markup
    end
    def getRenderKey (context)
      @key + '' + parse_params(context).map{|k,v| "#{k}=#{v}"}.join('&')
    end
    def render(context)
      hashKey = getRenderKey(context)
      @@hash_values ||= Hash.new do |h, key|
        answer = @@lastSuper.call
        h[key] = answer
      end
      @@lastSuper = lambda do
        newRender = super(context)
        newRender
      end
      @@hash_values[hashKey]
    end
  end
end
Liquid::Template.register_tag('meminclude'.freeze, Jekyll::MemInclude)
