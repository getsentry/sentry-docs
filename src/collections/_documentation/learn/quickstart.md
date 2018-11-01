---
title: 'Getting Started'
permalink: /quickstart/
sidebar_order: 0
---

For an overview of what Sentry does, take a look at the Sentry [workflow](https://blog.sentry.io/2018/03/06/the-sentry-workflow).

Sentry is designed to be very simple to get off the ground, yet powerful to grow into. If you have never used Sentry before, this tutorial will help you getting started.

Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#pick-a-client-integration)
2.  [Configure it](#configure-the-sdk)

## Install an SDK {#pick-a-client-integration}

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of both how your application works. In case your environment is very specific, you can also roll your own SDK using our document [_SDK API_]({%- link _documentation/clientdev/index.md -%}).

{% capture __alert_content -%}
Your platform is not listed?  There are more SDKs we support: [list of SDKs]({%- link _documentation/platforms/index.md -%})
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

{% wizard %}
{% include components/platform_content.html content_dir='getting-started-install' %}

{% wizard hide %}
## Configure the SDK {#configure-the-sdk}

After you completed setting up a project in Sentry, you’ll be given a value which we call a _DSN_, or _Data Source Name_. It looks a lot like a standard URL, but it’s actually just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.
{% endwizard %}

{% include components/platform_content.html content_dir='getting-started-config' %}

Most SDKs will now automatically collect data if available, some require some extra configuration as automatic error collecting is not
available due to platform limitations.
{% endwizard %}

{% capture __alert_content -%}
As of Sentry 9, we removed the need to provide the secret key. Older versions of SDKs may still require you to provide the DSN including the secret which is now called DSN (Legacy). Please check the corresponding docs of the SDK you are using if you still need to provide the secret.

The DSN can be found in Sentry by navigating to [Project Name] -> Project Settings -> Client Keys (DSN). Its template resembles the following:

```
'{PROTOCOL}://{PUBLIC_KEY}@{HOST}/{PROJECT_ID}'
```

Note: If you’re using Heroku, and you’ve added Hosted Sentry via the standard addon hooks, most SDKs will automatically pick up the `SENTRY_DSN` environment variable that we’ve already configured for you.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Next Steps

Now that you’ve got basic reporting setup, you’ll want to explore adding additional context to your data.

{% include components/platform_content.html content_dir='getting-started-next-steps' %}
-   [_manual error and event capturing_]({%- link _documentation/learn/capturing.md -%})
-   [_configuration options_]({%- link _documentation/learn/configuration.md -%})
-   [_adding context (tags, user and extra information)_]({%- link _documentation/learn/context.md -%})
-   [_tracing issues with breadcrumbs_]({%- link _documentation/learn/breadcrumbs.md -%})
-   [_capturing user feedback on crashes_]({%- link _documentation/learn/user-feedback.md -%})
