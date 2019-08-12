module Jekyll
  class VersionAddedTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      "*(New in version #{@text.strip})*"
    end
  end
end

Liquid::Template.register_tag('version_added', Jekyll::VersionAddedTag)
