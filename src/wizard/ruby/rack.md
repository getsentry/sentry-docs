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

Add `use Sentry::Rack::CaptureException` and `use Sentry::Rack::Tracing` to your `config.ru` or other rackup file (this is automatically inserted in Rails):

```ruby
require 'sentry-ruby'

Sentry.init do |config|
  config.dsn = '___PUBLIC_DSN___'

  # To activate performance monitoring, set one of these options.
  # We recommend adjusting the value in production:
  config.traces_sample_rate = 0.5
  # or
  config.traces_sampler = lambda do |context|
    true
  end
end

use Sentry::Rack::Tracing
use Sentry::Rack::CaptureException
```
