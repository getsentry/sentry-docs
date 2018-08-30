require 'json'

module Jekyll

  class CategoryPage < Page
    def initialize(site, base, dir, platform)
      @site = site
      @base = base
      @dir = dir
      @name = "#{platform["slug"]}.json"
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'json.json')
      keys = ["support_level","type","name","doc_link","body"]
      self.data['json'] = platform.select {|key,_| keys.include? key}
    end
  end

  class IndexPage < Page
    def initialize(site, base, dir, payload)
      @site = site
      @base = base
      @dir = dir
      @name = "_index.json"
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'json.json')
      self.data['json'] = payload
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    def get_headings(md)
      headings = []
      enabled = true
      # Make an index of all headings and their line numbers in the file
      md.each_line.with_index do |line, i|
        enabled = !enabled if line =~ /^```/
        if enabled && line =~ /^(#+)/
          headings << {
            line: i,
            level: $1.size,
            # Remove initial hash or trailing attribute list
            slug: Utils.slugify(line.gsub(/(^#+ |\s?\{.*\}$)/,''))
          }
        end
      end
      headings
    end

    def generate(site)
      return if !ENV["JEKYLL_DISABLE_PLATFORM_API"].nil?

      # Create an index of all the sections in every document
      docs = {}
      site.collections["documentation"].docs.each do |doc|
        content = doc.to_s
        sections = {
          :document => content
        }
        headings = get_headings(content)
        headings.each do |heading|
          startLine = heading[:line]
          close = headings.find {|h| h[:line] > startLine && heading[:level] >= h[:level]}
          if !close.nil?
            endLine = close[:line]
            sections[heading[:slug]] = content.lines[startLine, endLine - startLine].join
          else
            sections[heading[:slug]] = content.lines[startLine..-1].join
          end
        end

        docs[doc.relative_path] = sections
      end

      indexPayload = {
        :platforms => {}
      }

      # Generate each file
      site.data["platforms"].each do |platform|
        body = ""
        platform["wizard"].each do |wiz|
          file, section = wiz.split '#'
          section ||= :document
          if docs[file][section].nil?
            raise "Cannot find section '#{section}' in #{file}"
          end
          body += docs[file][section]
        end

        platform["body"] = site.find_converter_instance(
          Jekyll::Converters::Markdown
        ).convert(body)

        pathData = Pathname(platform["doc_link"]).each_filename.to_a

        if pathData.size > 2
          dir = "_platforms/#{pathData[1]}"
          indexKey = platform["slug"]
        else
          dir = "_platforms"
          indexKey = "_self"
        end

        platformKey = pathData[1]

        detailName = "#{platform["slug"]}.json"

        # In which the javascript guy pretends to ruby
        indexPayload[:platforms][platformKey] ||= {}
        indexPayload[:platforms][platformKey][indexKey] ||= {}
        indexPayload[:platforms][platformKey][indexKey] = {
          :type => platform["type"],
          :details => pathData.size > 2 ? File.join(pathData[1], detailName) : detailName,
          :doc_link => platform["doc_link"],
          :name => platform["name"]
        }

        site.pages << CategoryPage.new(site, site.source, dir, platform)
      end

      site.pages << IndexPage.new(site, site.source, "_platforms", indexPayload)
    end
  end
end
