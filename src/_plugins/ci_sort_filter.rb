module Jekyll
  module CaseInsensitiveSortFilter
    def ci_sort(input, arg=nil)
      unless arg.nil?
        input.sort_by { |x| (x[arg] || '').downcase }
      else
        input.sort_by { |x| (x || '').downcase }
      end
    end
  end
end
  
Liquid::Template.register_filter(Jekyll::CaseInsensitiveSortFilter)
