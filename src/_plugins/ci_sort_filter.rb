module Jekyll
  module CaseInsensitiveSortFilter
    def ci_sort(input, arg)
      input.sort_by { |x| (x[arg] || '').downcase }
    end
  end
end
  
Liquid::Template.register_filter(Jekyll::CaseInsensitiveSortFilter)
