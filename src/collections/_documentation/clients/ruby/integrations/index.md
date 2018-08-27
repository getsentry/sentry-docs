---
title: Integrations
---

For common environments and frameworks like Rails, Rake, Rack and others Ruby Raven provides automatic integration for reporting. Most of the time you don’t need to change anything, although you can configure those features if you want.

-   [Ruby on Rails]({%- link _documentation/clients/ruby/integrations/rails.md -%})
-   [Rack (Sinatra etc.)]({%- link _documentation/clients/ruby/integrations/rack.md -%})
-   [Puma]({%- link _documentation/clients/ruby/integrations/puma.md -%})
-   [Heroku]({%- link _documentation/clients/ruby/integrations/heroku.md -%})

The following integrations are available:

-   Sidekiq (`:sidekiq`)
-   `Delayed::Job` (`:delayed_job`)
-   Rake (`:rake`)
-   Rack (`:rack`)
-   Rails (`:railties`)

## Manually using integrations

Integrations are automatically loaded by default. This can be problematic if the default integration behavior doesn’t suit your projects’ needs.

To explicitly include integrations:

```ruby
require 'sentry-raven-without-integrations'
Raven.inject_only(:railties, :rack, :rake)
```

To blacklist integrations:

```ruby
require 'sentry-raven-without-integrations'
Raven.inject_without(:sidekiq, :delayed_job)
```

If you’re using bundler, then in your gemfile:

```ruby
gem 'sentry-raven', require: 'sentry-raven-without-integrations'
```

And in some sort of initializer:

```ruby
Raven.inject_without(:sidekiq)
```
