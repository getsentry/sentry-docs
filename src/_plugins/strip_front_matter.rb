module Jekyll
  module StripFrontMatter
    def strip_front_matter(input)
      input.to_s.gsub(/^---\n.*\n---/, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::StripFrontMatter)
