require "nokogiri"
require "json"
require "uri"

# The platform api is generated based on the `wizard` key in platforms.yml. This
# key can either be an array of documents with optional section slugs, or `true`
# which sets the value to `_documentation/quickstart.md` and renders only
# the content for that platform.
#
# In the targeted files, the wizard section is indicated by a comment, like so:
#   <!-- WIZARD optional-section-slug -->
#   <!-- ENDWIZARD -->
#
# Slugs are optional and are only useful for documents where only one of many
# sections must be referenced, or when sections must be reordered.
#
# When a file is specified without a section, all wizard blocks will be
# concatinated. If a section is specified, only the matching block will be used.
#
# Example:
#
#   # Renders the quickstart template for that platform
#   wizard: true
#
#   # Renders the content of the <!-- WIZARD --> of 'doc.md' and then the of
#   # <!-- WIZARD section-slug --> of 'doc-with-secion.md'.
#   wizard:
#     - _documentation/path/to/doc.md
#     - _documentation/path/to/doc-with-section.md#section-slug

class PlatformAPIError < StandardError
end

class CategoryPage < Jekyll::Page
  def initialize(site, base, dir, platform, name)
    @site = site
    @base = base
    @dir = dir
    @name = name
    @data ||= {}
    self.process(@name)
    keys = ["support_level","type","name","doc_link","body"]
    payload = platform.select {|key,_| keys.include? key}
    self.output = payload.to_json
  end
end

class IndexPage < Jekyll::Page
  def initialize(site, base, dir, payload, name)
    @site = site
    @base = base
    @dir = dir
    @name = name
    @data ||= {}
    self.process(@name)
    self.output = payload.to_json
  end
end

Jekyll::Hooks.register :site, :post_render, priority: :high do |site|
  if ENV["JEKYLL_ENABLE_PLATFORM_API"] == "false"
    puts "Platform API is disabled. Run with JEKYLL_ENABLE_PLATFORM_API=true to enable"
    return
  end

  puts "Compiling platform API"

  index_payload = {
    :platforms => {}
  }

  site.data["platforms"].each do |platform|
    next if platform["wizard"].nil? || platform["wizard_parent"].nil?

    # Create entry for _platforms/_index.json
    file_name = "#{platform["slug"]}.json"
    group_slug = platform["wizard_parent"]
    is_self = group_slug === platform["slug"]
    grouped_file = group_slug === platform["slug"] ? file_name : "#{group_slug}/#{file_name}"

    # This is a workaround to match JavaScript to browser docs now
    if platform["wizard"] === true and platform["slug"] == "javascript"
      platform["slug"] = "browser"
      is_self = true
      grouped_file = file_name
    end

    platform_slug = is_self ? "_self" : platform["slug"]
    doc_link = platform["wizard"] === true ? "/error-reporting/quickstart/?platform=#{platform["slug"]}" : platform["doc_link"]
    platform["doc_link"] = "#{site.config["url"]}#{ doc_link }"

    index_payload[:platforms][group_slug] ||= {}
    index_payload[:platforms][group_slug][platform_slug] = {
      :type => platform["type"],
      :details => grouped_file,
      :doc_link => platform["doc_link"],
      :name => platform["name"]
    }

    documentation = site.collections["documentation"].docs

    directives = case platform["wizard"]
    when TrueClass
      ["_documentation/error-reporting/quickstart.md"]
    when Array
      platform["wizard"]
    when NilClass
    else
      raise PlatformAPIError, "Unsupported value for `wizard` in #{platform["slug"]}: Must be `true` or an array of file paths."
    end

    # Create entry for _platforms/<platform>.json or _platforms/<parent>/<platform>.json
    wizard_snippets = directives.map do |directive|
      file_path, section_id = directive.split "#"
      document = documentation.find { |d| d.relative_path === file_path }
      blocks = document.content.scan(/<!--\s?WIZARD\s?([^\s]*?)\s?-->([\s\S]+?)<!--\s?ENDWIZARD\s?-->/)

      body = if section_id.nil?
        blocks.map { |b| b[1] }.join
      else
        match = blocks.find { |b| b[0] === section_id }
        raise PlatformAPIError, "Could not find wizard section '#{section_id}' in #{file_path}" if match.nil?
        match[1]
      end

      body = body.gsub(/<!--\s?WIZARDHIDE\s?([^\s]*?)\s?-->[\s\S]+?<!--\s?ENDWIZARDHIDE\s?-->/, "")

      # Strip out platform content that doesn't relate to the current platform
      noko_doc = Nokogiri::HTML(body)
      noko_doc.css(".platform-specific-content").each do |node|
        platform_content = node.css("[data-slug='#{platform["slug"]}']").children
        raise PlatformAPIError, "Could not find platform content for '#{platform["slug"]}' in #{file_path}" if platform_content.empty?
        node.replace platform_content
      end

      # Convert links to absolute URLs to the docs
      noko_doc.css("a").each do |node|
        node["href"] = URI(node["href"]).host ? node["href"] : "#{site.config["url"]}#{node["href"]}"
      end

      # Extract nested highlights so sentry CSS can target the `pre`s
      noko_doc.css(".highlighter-rouge").each do |node|
        highlighted_content = node.css("pre.highlight")
        node.replace highlighted_content if highlighted_content.any?
      end

      noko_doc.css("body").children.to_s
    end

    platform["body"] = wizard_snippets.join.strip

    dir = is_self ? "_platforms" : "_platforms/#{group_slug}"

    # The first two cases are legacy structure for docs
    case platform['slug']
    when "cocoa"
      index_payload[:platforms]["react-native"] ||= {}
      index_payload[:platforms]["react-native"]["_self"] = {
        :type => platform["type"],
        :details => file_name,
        :doc_link => platform["doc_link"],
        :name => platform["name"]
      }
      site.pages << CategoryPage.new(site, site.source, "_platforms", platform, file_name)
      index_payload[:platforms]["react-native"].delete "cocoa"
    when "objc"
      index_payload[:platforms]["cocoa"] ||= {}
      index_payload[:platforms]["cocoa"]["_self"] = {
        :type => platform["type"],
        :details => file_name,
        :doc_link => platform["doc_link"],
        :name => platform["name"]
      }
      site.pages << CategoryPage.new(site, site.source, "_platforms", platform, file_name)
      site.pages << CategoryPage.new(site, site.source, dir, platform, file_name)
    else
      site.pages << CategoryPage.new(site, site.source, dir, platform, file_name)
    end
  end

  site.pages << IndexPage.new(site, site.source, "_platforms", index_payload, "_index.json")
end
