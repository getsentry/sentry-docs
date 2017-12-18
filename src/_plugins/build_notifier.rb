begin
  require 'terminal-notifier'
  module Jekyll
    class Site
      alias jekyll_process process
      def process
        jekyll_process
      rescue => e
        TerminalNotifier.notify("💥 Jekyll rebuild failed: #{e.message}")
        raise e
      end
    end
  end
rescue LoadError
  # nothing
end
