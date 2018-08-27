module Jekyll
  module CompactWhitespaceFilter

    # This converts newlines to spaces, allowing for flattening documents
    # into a single line.
    def compact_whitespace(input)
      input.gsub(/\s+/, ' ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::CompactWhitespaceFilter)
