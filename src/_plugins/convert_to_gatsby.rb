require 'fileutils'

module GatsbyConverter
  GATSBY_CONTENT_ROOT = "gatsby/src/docs"

  HIJACK_INCLUDE_PATHS = {
    "components/platform_content.html" => "components/gatsby/platform_content.html",
    "components/alert.html" => "components/gatsby/alert.html"
  }

  VALID_FRONTMATTER = Set["draft", "categories", "toc", "title", "sidebar_order", "robots", "tags"]

  # {% asset guides/integrate-frontend/upload-source-maps-010.png @path %}
  # need to swap out w/ markdown-style image embed
  class AssetTagHijack < Jekyll::Assets::Tag
    def parse_args(args)
      return args if args.is_a?(Liquid::Tag::Parser) || args.is_a?(Hash)
      Liquid::Tag::Parser.new(
        @args
      )
    end

    def render(ctx)
      args = parse_args(@args).to_h
      return args[:argv1] if args.has_key?(:path) and args[:path]
      alt = args.has_key?(:alt) ? args[:alt] : ""
      return "![#{alt}](#{args[:argv1]})"
      super(ctx)
    end
  end

  # Wizard does not exist in Gatsby
  class WizardTagHijack < Liquid::Block
    def render(context)
      super(context)
    end
  end

  class IncludeTagHijack < Jekyll::Tags::IncludeTag
    def locate_include_file(context, file, safe)
      file = HIJACK_INCLUDE_PATHS[file.to_s] if HIJACK_INCLUDE_PATHS.include?(file.to_s)
      super(context, file, safe)
    end
  end

  class IncludeRelativeTagHijack < Jekyll::Tags::IncludeRelativeTag
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

  Jekyll::Hooks.register :site, :pre_render, priority: :low do |site|
    if ENV["JEKYLL_TO_GATSBY"] != "1"
      puts "JEKYLL_TO_GATSBY is not configured. Not automatically converting pages."
      next
    end


    tags = {
      "include" => GatsbyConverter::IncludeTagHijack,
      "include_relative" => GatsbyConverter::IncludeRelativeTagHijack,
      "wizard" => GatsbyConverter::WizardTagHijack,
      "asset" => GatsbyConverter::AssetTagHijack,
    }
    old_tags = {}

    begin
      tags.each do |k, v|
        old_tags[k] = Liquid::Template.tags[k]
        Liquid::Template.tags[k] = v
      end

      Converter.new.convert_site(site)
    ensure
      old_tags.each do |k, v|
        Liquid::Template.tags[k] = v
      end
    end
  end

  class Converter
    def convert_site(site)
      puts "Convert Jekyll pages for Gatsby"

      site.collections["documentation"].docs.each do |d|
        convert_document(d)
      end
    end

    def convert_document(document)
      file_system = FileSystemHijack.new(Liquid::Template.file_system)

      site = document.site

      liquid_options = site.config["liquid"]
      payload = site.site_payload

      template = Liquid::Template.parse(document.content)

      info = {
        :registers => {
          :site => site,
          :page => document.to_liquid,
          :file_system => file_system,
        },
        :strict_filters  => liquid_options["strict_filters"],
        :strict_variables => liquid_options["strict_variables"],
      }
      body = template.render!(payload, info).strip

      body = body.gsub(/<!--\s?END?WIZARD(HIDE)?\s?([^\s]*?)\s?-->/, "")

      # _documentation/clients/python/index.md -> [root]/clients/python/index.mdx
      page_path = document.relative_path.gsub(/^_documentation/, GATSBY_CONTENT_ROOT).gsub(/\.md$/, '.mdx')

      # {"draft"=>false, "categories"=>[], "layout"=>"legacy-client", "toc"=>true, "permalink"=>"/:path/", "title"=>"Python", "sidebar_order"=>12, "robots"=>"noindex", "slug"=>"index", "ext"=>".md", "tags"=>[], "excerpt"=><Excerpt: /clients/index#excerpt>}
      # document.data is frontmatter

      # only write file if it doesnt exist, and body isnt empty
      if !document.data["gatsby"]
        write_page(page_path, body, document.data.select { |k, v| VALID_FRONTMATTER.include?(k) })
      end
    end

    def write_page(path, markdown, frontmatter)
      puts("Writing #{path}")
      FileUtils.mkdir_p File.dirname(path)
      File.open(path, "w") do |f|
        f.write("---\n")
        frontmatter.each { |k, v| f.write("#{k}: #{v}\n") }
        f.write("---\n")
        f.write(markdown)
      end
    end
  end
end
