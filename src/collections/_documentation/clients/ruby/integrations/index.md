---
title: Integrations
---

For common environments and frameworks like [Rails](#ruby-on-rails), Rake, Rack and others Ruby Raven provides automatic integration for reporting. Most of the time you don’t need to change anything, although you can configure those features if you want.

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

## Ruby on Rails

<!-- WIZARD -->
In Rails, all uncaught exceptions will be automatically reported.

We support Rails 4 and newer.

### Installation

Install the SDK via Rubygems by adding it to your `Gemfile`:

```ruby
gem "sentry-raven"
```

### Configuration

Open up `config/application.rb` and configure the DSN, and any other [_settings_]({%- link _documentation/clients/ruby/config.md -%}) you need:

```ruby
Raven.configure do |config|
  config.dsn = '___DSN___'
end
```

If you have added items to [Rails’ log filtering](http://guides.rubyonrails.org/action_controller_overview.html#parameters-filtering), you can also make sure that those items are not sent to Sentry:

```ruby
# in your application.rb:
config.filter_parameters << :password

# in an initializer, like sentry.rb
Raven.configure do |config|
  config.sanitize_fields = Rails.application.config.filter_parameters.map(&:to_s)
end
```

### Params and sessions

```ruby
class ApplicationController < ActionController::Base
  before_action :set_raven_context

  private

  def set_raven_context
    Raven.user_context(id: session[:current_user_id]) # or anything else in session
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end
end
```

### Caveats

Currently, custom exception applications (_config.exceptions_app_) are not supported. If you are using a custom exception app, you must manually integrate Raven yourself.
<!-- ENDWIZARD -->
