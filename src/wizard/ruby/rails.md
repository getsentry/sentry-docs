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

Initialize the SDK within your `config/initializers/sentry.rb`:

```ruby
Sentry.init do |config|
  config.dsn = '___PUBLIC_DSN___'
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  # Set tracesSampleRate to 1.0 to capture 100%
  # of transactions for performance monitoring.
  # We recommend adjusting this value in production
  config.traces_sample_rate = 0.5
  # or
  config.traces_sampler = lambda do |context|
    true
  end
end
```

### Caveats

Currently, custom exception applications (_config.exceptions_app_) are not supported. If you are using a custom exception app, you must manually integrate Sentry yourself.
