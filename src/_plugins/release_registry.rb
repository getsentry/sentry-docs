require 'net/http'

module Jekyll
  class ReleaseRegistryTag < Liquid::Tag 
    CACHE = {}

    def initialize(tag_name, text, tokens)
      super
      @params = text.split(/\s+/)
    end

    def render(context)
      get_info["version"]
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
  end

  class SdkVersionTag < ReleaseRegistryTag
    def entity
      "sdks"
    end
  end
end

Liquid::Template.register_tag('package_version', Jekyll::PackageVersionTag)
Liquid::Template.register_tag('sdk_version', Jekyll::SdkVersionTag)
