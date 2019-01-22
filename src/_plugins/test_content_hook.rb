require "nokogiri"

if ENV['TEST_MODE'] == 'true'

  # Get a plain text version of the final rendered post that we can use for
  # style guide testing
  Jekyll::Hooks.register :documents, :post_render, priority: :low do |document|

    body = Nokogiri::HTML(document.output)
    body.css('pre').remove
    body.css('code').remove

    document.data['plaintext'] = body.xpath("//*[@id='main']//text()").text

  end

end
