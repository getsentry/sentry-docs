# If a documet is titled index.html, Jekyll will create the file at
# .../index/index.html. This strips the index/ off so the file goes to the
# correct location.
Jekyll::Hooks.register :site, :pre_render, priority: :high do |site|
  site.documents.each {|doc| doc.url.gsub! "/index/", "/"}
end
