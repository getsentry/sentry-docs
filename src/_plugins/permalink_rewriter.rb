# If a documet is titled index.html, Jekyll will create the file at
# .../index/index.html. This strips the index/ off so the file goes to the
# correct location.
Jekyll::Hooks.register :documents, :post_render, priority: :low do |doc|
  if ["documentation", "dev_components"].include? doc.collection.label
    doc.url.gsub! "index/", ""
  end
end
