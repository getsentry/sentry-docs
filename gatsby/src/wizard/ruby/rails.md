---
name: Rails
doc_link: https://docs.sentry.io/clients/ruby/integrations/rails/
support_level: production
type: framework
---
In Rails, all uncaught exceptions will be automatically reported.

We support Rails 4 and newer.

### Installation

Install the SDK via Rubygems by adding it to your `Gemfile`:

```ruby
gem "sentry-raven"
```

### Configuration

Open up `config/application.rb` and configure the DSN, and any other [_settings_](/clients/ruby/config/) you need:

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
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
