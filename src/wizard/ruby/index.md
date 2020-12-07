---
name: Ruby
doc_link: https://docs.sentry.io/platforms/ruby/
support_level: production
type: language
---

## Installation {#install}

Sentry Ruby comes as a gem and is straightforward to install. If you are using Bundler just add this to your `Gemfile`:

```ruby
gem "sentry-ruby"
```

## Configuration {#configure}

To use Sentry Ruby all you need is your DSN. Like most Sentry libraries it will honor the `SENTRY_DSN` environment variable. You can find it on the project settings page under API Keys. You can either export it as environment variable or manually configure it with `Sentry.init`:

```ruby
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
```

## Usage {#usage}

You can then report errors or messages to Sentry:

```ruby
begin
  1 / 0
rescue ZeroDivisionError => exception
  Sentry.capture_exception(exception)
end

Sentry.capture_message("test message")
```
