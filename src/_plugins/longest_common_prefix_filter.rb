module Jekyll
  module LongestCommonPrefix
    def lcp(input)
      return "" if input.empty?
      min, max = input.minmax
      idx = min.size.times{|i| break i if min[i] != max[i]}
      min[0...idx]
    end
  end
end

Liquid::Template.register_filter(Jekyll::LongestCommonPrefix)
