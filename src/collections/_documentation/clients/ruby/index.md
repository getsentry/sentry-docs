---
title: Ruby
sidebar_relocation: platforms
---

Raven for Ruby is a client and integration layer for the Sentry error reporting API. It supports Ruby 1.9.3 and 2.x. JRuby support is provided but experimental.

## Getting Started
Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
3.  [Configure it](#configure)

<!-- WIZARD -->
## Installation {#install}

Raven Ruby comes as a gem and is straightforward to install. If you are using Bundler just add this to your `Gemfile`:

```ruby
gem "sentry-raven"
```

For other means of installation see [_Installation_]({%- link _documentation/clients/ruby/install.md -%}).

## Configuration {#configure}

To use Raven Ruby all you need is your DSN. Like most Sentry libraries it will honor the `SENTRY_DSN` environment variable. You can find it on the project settings page under API Keys. You can either export it as environment variable or manually configure it with `Raven.configure`:

```ruby
Raven.configure do |config|
  config.dsn = '___DSN___'
end
```

## Reporting Failures

If you use Rails, Rake, Sidekiq, etc, you’re already done - no more configuration required! Check [_Integrations_]({%- link _documentation/clients/ruby/integrations.md -%}) for more details on other gems Sentry integrates with automatically.

Rack requires a little more setup: [_Rack (Sinatra etc.)_]({%- link _documentation/clients/ruby/integrations.md -%}#rack-sinatra-etc)

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
<!-- ENDWIZARD -->

## Additional Context

Much of the usefulness of Sentry comes from additional context data with the events. Raven Ruby makes this very convenient by providing methods to set thread local context data that is then submitted automatically with all events.

There are three primary methods for providing request context:

```ruby
# bind the logged in user
Raven.user_context email: 'foo@example.com'

# tag the request with something interesting
Raven.tags_context interesting: 'yes'

# provide a bit of additional context
Raven.extra_context happiness: 'very'
```

For more information see [_Context_]({%- link _documentation/clients/ruby/context.md -%}).

## Deep Dive

Want to know more? We have a detailed documentation about all parts of the library and the client integrations.

-   [Installation]({%- link _documentation/clients/ruby/install.md -%})
-   [Configuration]({%- link _documentation/clients/ruby/config.md -%})
-   [Usage]({%- link _documentation/clients/ruby/usage.md -%})
-   [Breadcrumbs]({%- link _documentation/clients/ruby/breadcrumbs.md -%})
-   [Context]({%- link _documentation/clients/ruby/context.md -%})
-   [Processors]({%- link _documentation/clients/ruby/processors.md -%})
-   [Integrations]({%- link _documentation/clients/ruby/integrations.md -%})
    -   [Ruby on Rails]({%- link _documentation/clients/ruby/integrations.md -%}#ruby-on-rails)
    -   [Rack (Sinatra etc.)]({%- link _documentation/clients/ruby/integrations.md -%}#rack-sinatra-etc)
    -   [Puma]({%- link _documentation/clients/ruby/integrations.md -%}#puma)
    -   [Heroku]({%- link _documentation/clients/ruby/integrations.md -%}#heroku)

Resources:

-   [Bug Tracker](http://github.com/getsentry/raven-ruby/issues)
-   [GitHub Project](http://github.com/getsentry/raven-ruby)
