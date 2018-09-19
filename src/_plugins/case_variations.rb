module Jekyll
  class CaseVariationsTag < Liquid::Tag

    def initialize(tag_name, key, options)
      super
      @key = key
    end

    def render_variation(variation, value)
      %Q(
        <span class="config-key" data-config-key-variation="#{variation}">#{value}</span>
      )
    end

    def render(context)
      parts = @key.split(/-/)
      snake_case = @key.gsub('-', '_')
      camel_case = parts.each_with_index { |val, idx|
        idx == 0 ? val : val.capitalize!
      }.join('')
      pascal_case = parts.map { |v| v.capitalize }.join('')
      [
        render_variation("canonical", @key),
        render_variation("snake_case", snake_case),
        render_variation("camelCase", camel_case),
        render_variation("PascalCase", pascal_case),
      ].join("\n")
    end
  end
end
Liquid::Template.register_tag('case_variations'.freeze, Jekyll::CaseVariationsTag)
