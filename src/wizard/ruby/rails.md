---
name: Rails
doc_link: https://docs.sentry.io/platforms/ruby/guides/rails/
support_level: production
type: framework
---

In Rails, all uncaught exceptions will be automatically reported.

We support Rails 5 and newer.

## Installation

Add `sentry-ruby` and `sentry-rails` to your `Gemfile`:

```ruby
gem "sentry-ruby"
gem "sentry-rails"
```

## Configuration

Initialize the SDK within your `config/application.rb`:

```ruby
Sentry.init do |config|
  config.dsn = '___PUBLIC_DSN___'
  config.breadcrumbs_logger = [:active_support_logger]

  # To activate performance monitoring, set one of these options.
  # We recommend adjusting the value in production:
  config.traces_sample_rate = 0.5
  # or
  config.traces_sampler = lambda do |context|
    true
  end
end
```

### Caveats

Currently, custom exception applications (_config.exceptions_app_) are not supported. If you are using a custom exception app, you must manually integrate Sentry yourself.
