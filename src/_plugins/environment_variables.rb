module Jekyll

  class EnvironmentVariablesGenerator < Generator

    # Pass any environment variables that start with JEKYLL_ on to Jekyll, where
    # they can be access on the `site` object, like {{ site.JEKYLL_MY_VAR }}
    def generate(site)
      keys = ENV.keys.select { |i| i[/^JEKYLL_/] }
      keys.each { |k| site.config[k] = ENV[k] }
    end

  end

end
