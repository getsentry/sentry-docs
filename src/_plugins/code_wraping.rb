require "nokogiri"

# When <code> blocks wrap, they tend to break on characters that make examples
# difficult to follow. The problem is especially pronounced with dashes, which
# in prose are considered safe to break upon but in code are most often
# directly associated with the attached characters. This plugin inserts a span
# with a css class that includes an uncopyable (to prevent syntax errors),
# zero-width, non-breaking space to hold characters together within code blocks
Jekyll::Hooks.register :documents, :post_render, priority: :low do |document|

  nbr_markup = '<span class="no-break"></span>'

  characters = [
    '-'
  ]

  matched_characters = "[#{characters.join('')}]"

  body = Nokogiri::HTML(document.output)
  body.css('code.highlighter-rouge').each do |node|

    # Chunk the input into strings of consecutive, non-space characters that do or
    # don't contain matched_characters
    chunks = node.content.split(Regexp.new("(\\S*#{matched_characters}\\S*)"))

    # Split on matched_characters, then join with the nbr_markup. This ensures
    # we don't add nbr_markup next to spaces.
    chunks.map! do |chunk|
      replacement_chunks = chunk.split(Regexp.new("(#{matched_characters})"))
      replacement_chunks.reject! { |e| e.to_s.empty? }
      replacement_chunks.join(nbr_markup)
    end

    node.inner_html = chunks.join('')
  end

  document.output = body
end
