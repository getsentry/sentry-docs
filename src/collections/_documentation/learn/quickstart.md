---
title: 'Getting Started'
permalink: /quickstart/
---

For an overview of what Sentry does, take a look at the Sentry [workflow](https://blog.sentry.io/2018/03/06/the-sentry-workflow).

Sentry is designed to be very simple to get off the ground, yet powerful to grow into. If you have never used Sentry before, this tutorial will help you getting started.

Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Configure an SDK](#pick-a-client-integration)
3.  [About the DSN](#configure-the-dsn)

## Configure an SDK {#pick-a-client-integration}

Sentry captures data by using an SDK within your application’s runtime. These are platform specific, and allow Sentry to have a deep understanding of both how your application works. In case your environment is very specific, you can also roll your own SDK using our document [_SDK API_]({%- link _documentation/clientdev/index.md -%}).

Popular integrations are:

-   [_Python_]({%- link _documentation/clients/python/index.md -%})
-   [_JavaScript_]({%- link _documentation/clients/javascript/index.md -%})
-   [_PHP_]({%- link _documentation/clients/php/index.md -%})
-   [_Ruby_]({%- link _documentation/clients/ruby/index.md -%})
-   [_Java_]({%- link _documentation/clients/java/index.md -%})
-   [_Cocoa_]({%- link _documentation/clients/cocoa/index.md -%})
-   [_C#_]({%- link _documentation/clients/csharp/index.md -%})
-   [_Go_]({%- link _documentation/clients/go/index.md -%})
-   [_Elixir_]({%- link _documentation/clients/elixir/index.md -%})

For exact configuration for the integration consult the corresponding documentation. For all SDKs however, the basics are the same.

## About the DSN {#configure-the-dsn}

After you complete setting up a project in Sentry, you’ll be given a value which we call a _DSN_, or _Data Source Name_. It looks a lot like a standard URL, but it’s actually just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

{% capture __alert_content -%}
As of Sentry 9, we removed the need to provide the secret key. Older versions of SDKs may still require you to provide the DSN including the secret which is now called DSN (Legacy). Please check the corresponding docs of the SDK you are using if you still need to provide the secret.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

The DSN can be found in Sentry by navigating to [Project Name] -> Project Settings -> Client Keys (DSN). Its template resembles the following:

```
'{PROTOCOL}://{PUBLIC_KEY}@{HOST}/{PATH}{PROJECT_ID}'
```

If you are using the Hosted Sentry and signed into your account, the documentation will refer to your actual DSNs. You can select the correct one which will adjust the examples for easy copy pasting:

```
'___PUBLIC_DSN___'
```

It is composed of five important pieces:

-   The Protocol used. This can be one of the following: http or https.
-   The public key to authenticate the SDK.
-   The destination Sentry server.
-   The project ID which the authenticated user is bound to.

You’ll have a few options for plugging the DSN into the SDK, depending on what it supports. At the very least, most SDKs will allow you to set it up as the `SENTRY_DSN` environment variable or by passing it into the SDK’s constructor.

For example for the JavaScript SDK it works roughly like this:

```javascript
import Raven from 'raven-js'
Raven.config('___PUBLIC_DSN___')
```

Note: If you’re using Heroku, and you’ve added Hosted Sentry via the standard addon hooks, most SDKs will automatically pick up the `SENTRY_DSN` environment variable that we’ve already configured for you.

## Next Steps

Now that you’ve got basic reporting setup, you’ll want to explore adding additional context to your data.

-   [_identifying users via context_]({%- link _documentation/learn/context.md -%})
-   [_tracing issues with breadcrumbs_]({%- link _documentation/learn/breadcrumbs.md -%})
-   [_capturing user feedback on crashes_]({%- link _documentation/learn/user-feedback.md -%})
