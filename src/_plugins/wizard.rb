module Jekyll
  class WizardTag < Liquid::Block

    def initialize(tag_name, text, tokens)
      super
      @flag = text
      @flag.chomp!
      @flag.strip!
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      content = converter.convert(super(context))
        
      case @flag
      when "hide" then %Q(<!-- WIZARDHIDE -->#{content}<!-- ENDWIZARDHIDE -->)
      else %Q(<!-- WIZARD #{@flag} -->#{content}<!-- ENDWIZARD -->)
      end
    end
  end
end

Liquid::Template.register_tag('wizard', Jekyll::WizardTag)
