---
name: Ruby
doc_link: https://docs.sentry.io/platforms/ruby/
support_level: production
type: language
---

## Installation {#install}

Raven Ruby comes as a gem and is straightforward to install. If you are using Bundler just add this to your `Gemfile`:

```ruby
gem "sentry-raven"
```

## Configuration {#configure}

To use Raven Ruby all you need is your DSN. Like most Sentry libraries it will honor the `SENTRY_DSN` environment variable. You can find it on the project settings page under API Keys. You can either export it as environment variable or manually configure it with `Raven.configure`:

```ruby
Raven.configure do |config|
  config.dsn = '___PUBLIC_DSN___'
end
```

## Reporting Failures

If you use Rails, Rake, Sidekiq, etc, you’re already done - no more configuration required! Check [_Integrations_](/platforms/ruby/configuration/integrations/) for more details on other gems Sentry integrates with automatically.

Rack requires a little more setup: [_Rack (Sinatra etc.)_](/platforms/ruby/guides/rack/)

Otherwise, Raven supports two methods of capturing exceptions:

```ruby
Raven.capture do
  # capture any exceptions which happen during execution of this block
  1 / 0
end

begin
  1 / 0
rescue ZeroDivisionError => exception
  Raven.capture_exception(exception)
end
```

You can add either of the snippets above into your application to verify that Sentry is set up correctly.
