---
name: Rack
doc_link: https://docs.sentry.io/platforms/ruby/guides/rack/
support_level: production
type: framework
---

### Installation

Install the SDK via Rubygems by adding it to your `Gemfile`:

```ruby
gem "sentry-raven"
```

### Configuration

Add `use Raven::Rack` to your `config.ru` or other rackup file (this is automatically inserted in Rails):

```ruby
require 'raven'

Raven.configure do |config|
  config.dsn = '___PUBLIC_DSN___'
end

use Raven::Rack
```
