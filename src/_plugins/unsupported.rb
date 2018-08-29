module Jekyll
  class UnsupportedTag < Liquid::Block

    def initialize(tag_name, text, tokens)
      super
      @slugs = text.split(/\s+/)
    end

    def platform_attr
      "unsupported-platforms"
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      content = converter.convert(super(context))
      %Q(<div class="unsupported" data-#{platform_attr}="#{@slugs.join(' ')}">#{content}</div>)
    end
  end

  class SupportedTag < UnsupportedTag
    def platform_attr
      "supported-platforms"
    end
  end
end

Liquid::Template.register_tag('unsupported', Jekyll::UnsupportedTag)
Liquid::Template.register_tag('supported', Jekyll::SupportedTag)
