---
name: Rack
doc_link: https://docs.sentry.io/platforms/ruby/guides/rack/
support_level: production
type: framework
---

### Installation

Install the SDK via Rubygems by adding it to your `Gemfile`:

```ruby
gem "sentry-ruby"
```

### Configuration

Add `use Sentry::Rack::CaptureException` to your `config.ru` or other rackup file (this is automatically inserted in Rails):

```ruby
require 'sentry-ruby'

Sentry.init do |config|
  config.dsn = '___PUBLIC_DSN___'
  # if you want to activate performance monitoring, you also need to set either one of these options
  #
  # config.traces_sample_rate = 0.5
  # config.traces_sampler = lambda do |context|
  #   true
  # end
end

use Sentry::Rack::Tracing # if you want to have performance monitoring
use Sentry::Rack::CaptureException
```
