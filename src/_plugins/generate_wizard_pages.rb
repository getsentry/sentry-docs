require 'fileutils'
require "nokogiri"
require "json"
require "uri"

class PlatformAPIError < StandardError
end

def write_page(path, markdown, frontmatter)
  full_path = "gatsby/src/wizard/#{path}"
  FileUtils.mkdir_p File.dirname(full_path)
  File.open(full_path, "w") do |f|
    f.write("---\n")
    frontmatter.each { |k, v| f.write("#{k}: #{v}\n") }
    f.write("---\n")
    f.write(markdown)
  end
end

HIJACK_INCLUDE_PATHS = {
  "components/platform_content.html" => "components/wizard_platform_content.html"
}

# TODO(dcramer): we'd love to load the uncached/unrendered file here (aka have raw markdown when we're done)
class IncludeTagHijack < Jekyll::Tags::IncludeTag
  def locate_include_file(context, file, safe)
    file = HIJACK_INCLUDE_PATHS[file.to_s] if HIJACK_INCLUDE_PATHS.include?(file.to_s)
    super(context, file, safe)
  end
end

class FileSystemHijack
  def initialize(file_system)
    @file_system = file_system
  end

  def read_template_file(template_path)
    template_path = HIJACK_INCLUDE_PATHS[template_path] if HIJACK_INCLUDE_PATHS.include?(template_path)
    @file_system.read_template_file(template_path)
  end
end

Jekyll::Hooks.register :site, :pre_render, priority: :high do |site|
  if ENV["JEKYLL_ENABLE_PLATFORM_API"] == "false"
    puts "Platform API is disabled. Run with JEKYLL_ENABLE_PLATFORM_API=true to enable"
    next
  end

  puts "Generating Wizard pages for Gatsby"
  # jekyll include sits own tag, which doesnt work the same as liquid (and doesnt use the file_system object)
  old_include = Liquid::Template.tags["include"]
  Liquid::Template.tags["include"] = IncludeTagHijack

  begin
    do_work(site)
  ensure
    Liquid::Template.tags["include"] = old_include
  end
end

def do_work(site)
  file_system = FileSystemHijack.new(Liquid::Template.file_system)

  liquid_options = site.config["liquid"]
  payload = site.site_payload

  site.data["platforms"].each do |platform|
    next if platform["wizard"].nil? || platform["wizard_parent"].nil?

    file_name = "#{platform["slug"]}.json"
    group_slug = platform["wizard_parent"]
    is_self = group_slug === platform["slug"]

    # This is a workaround to match JavaScript to browser docs now
    if platform["wizard"] === true and platform["slug"] == "javascript"
      wizard_slug = "browser"
      is_self = true
    elsif platform["wizard"] === true and platform["slug"] == "cocoa"
      wizard_slug = "swift"
    else
      wizard_slug = platform["slug"]
    end

    platform_slug = is_self ? "_self" : platform["slug"]
    doc_link = platform["wizard"] === true ? "/error-reporting/quickstart/?platform=#{wizard_slug}" : platform["doc_link"]
    platform["doc_link"] = "#{site.config["url"]}#{doc_link}"

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
    snippets = directives.map do |directive|
      file_path, section_id = directive.split "#"
      document = documentation.find { |d| d.relative_path === file_path }

      # https://humanwhocodes.com/blog/2019/04/jekyll-hooks-output-markdown/
      template = Liquid::Template.parse(document.content)
      template.assigns["wizard_slug"] = wizard_slug

      info = {
        :registers => {
          :site => site,
          :page => document.to_liquid,
          :file_system => file_system,
        },
        :strict_filters  => liquid_options["strict_filters"],
        :strict_variables => liquid_options["strict_variables"],
      }
      rendered_content = template.render!(payload, info)

      blocks = rendered_content.scan(/<!--\s?WIZARD\s?([^\s]*?)\s?-->([\s\S]+?)<!--\s?ENDWIZARD\s?-->/)

      body = if section_id.nil?
        blocks.map { |b| b[1] }.join
      else
        match = blocks.find { |b| b[0] === section_id }
        raise PlatformAPIError, "Could not find wizard section '#{section_id}' in #{file_path}" if match.nil?
        match[1]
      end

      body.gsub(/<!--\s?WIZARDHIDE\s?([^\s]*?)\s?-->[\s\S]+?<!--\s?ENDWIZARDHIDE\s?-->/, "")
    end

    body = snippets.join.strip

    if body == ""
      Jekyll.logger.warn "Wizard", "No content generated for wizard in #{platform["slug"]}"
      next
    end

    dir = is_self ? "_platforms" : "_platforms/#{group_slug}"
    page_path = is_self ? "#{platform["slug"]}/index.md" : "#{group_slug}/#{platform["slug"]}.md"

    # The first two cases are legacy structure for docs
    case platform['slug']
    when "cocoa"
      write_page("react-native/index.md", body, {
        :name => platform["name"],
        :doc_link => platform["doc_link"],
        :support_level => platform["support_level"],
        :type => platform["type"],
      })
      write_page(page_path, body, {
        :name => platform["name"],
        :doc_link => platform["doc_link"],
        :support_level => platform["support_level"],
        :type => platform["type"],
      })
    when "swift"
      write_page("cocoa/index.md", body, {
        :name => platform["name"],
        :doc_link => platform["doc_link"],
        :support_level => platform["support_level"],
        :type => platform["type"],
      })
      write_page(page_path, body, {
        :name => platform["name"],
        :doc_link => platform["doc_link"],
        :support_level => platform["support_level"],
        :type => platform["type"],
      })
    else
      write_page(page_path, body, {
        :name => platform["name"],
        :doc_link => platform["doc_link"],
        :support_level => platform["support_level"],
        :type => platform["type"],
      })
    end
  end
end
