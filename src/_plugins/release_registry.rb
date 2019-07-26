require 'net/http'

module Jekyll
  class ReleaseRegistryTag < Liquid::Tag 
    CACHE = {}

    def initialize(tag_name, text, tokens)
      super
      @params = text.split(/\s+/)
    end

    def entity
      raise NotImplementedError.new
    end

    private

    def name
      @params[0]
    end

    def version
      @params[1] || "latest"
    end

    def get_info
      self.class::CACHE[[entity, name, version]] ||=
        begin
          uri = URI("#{server}/#{entity}/#{name}/#{version}")
          JSON.parse(Net::HTTP.get(uri))
        rescue Exception => e
          raise RuntimeError.new("WARN: Failed to fetch version '#{version}' for '#{name}': #{e}")
        end
    end

    def server
      # XXX: This prints out the configuration path every time it's accessed.
      @server ||= Jekyll.configuration({})['release_service']
    end
  end

  class PackageVersionTag < ReleaseRegistryTag
    def entity
      "packages"
    end

    def render(context)
      get_info["version"]
    end
  end

  class SdkVersionTag < ReleaseRegistryTag
    def entity
      "sdks"
    end

    def render(context)
      get_info["version"]
    end
  end

  class SdkRepoUrlTag < ReleaseRegistryTag
    def entity
      "sdks"
    end

    def render(context)
      get_info["repo_url"]
    end
  end

  class SdkCdnChecksumTag < ReleaseRegistryTag
    def entity
      "sdks"
    end

    def render(context)
      file = @params[2]
      algorithm = "sha384-base64"
      checksum = get_info["files"][file]["checksums"][algorithm]
      
      if !checksum || checksum.empty?
        raise RuntimeError.new("WARN: Failed to fetch checksum for file '#{file}' from '#{name}' '#{version}' sdk: #{e}")
      end
      
      return "#{algorithm.split("-").first()}-#{checksum}"
    end
  end
end

Liquid::Template.register_tag('package_version', Jekyll::PackageVersionTag)
Liquid::Template.register_tag('sdk_version', Jekyll::SdkVersionTag)
Liquid::Template.register_tag('sdk_repo_url', Jekyll::SdkRepoUrlTag)
Liquid::Template.register_tag('sdk_cdn_checksum', Jekyll::SdkCdnChecksumTag)
