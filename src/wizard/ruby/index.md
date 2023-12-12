---
name: Ruby
doc_link: https://docs.sentry.io/platforms/ruby/
support_level: production
type: language
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

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

  # Set traces_sample_rate to 1.0 to capture 100%
  # of transactions for performance monitoring.
  # We recommend adjusting this value in production.
  config.traces_sample_rate = 1.0
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
