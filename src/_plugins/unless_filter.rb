module Jekyll
  module UnlessFilter
    def unless(input, arg)
      multi_arg = arg.split(/\s*,\s*/)
      if multi_arg.length == 1
        input.select do |x|
          x[arg].nil? || !x[arg]
        end
      else
        input.select do |x|
          x[multi_arg[0]] != multi_arg[1]
        end
      end
    end
  end
end
  
Liquid::Template.register_filter(Jekyll::UnlessFilter)
