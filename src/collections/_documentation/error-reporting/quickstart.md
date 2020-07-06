---
title: 'Getting Started'
sidebar_order: 0
---

For an overview of what Sentry does, take a look at the Sentry [workflow](https://blog.sentry.io/2018/03/06/the-sentry-workflow).

Sentry is designed to be both simple to get off the ground and powerful to grow into. If you have never used Sentry before, this tutorial helps you get started.

Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#pick-a-client-integration)
2.  [Configure your SDK](#configure-the-sdk)

## Install an SDK {#pick-a-client-integration}

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of how your application works.

{% capture __alert_content -%}
Your platform is not listed?  There are more SDKs we support: [list of SDKs](/platforms/)
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

{% wizard %}
{% include components/platform_content.html content_dir='getting-started-install' %}

{% wizard hide %}
## Configure the SDK {#configure-the-sdk}

After you completed setting up a project in Sentry, you’ll be given a value which we call a _DSN_, or _Data Source Name_. It looks a lot like a standard URL, but it’s actually just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.
{% endwizard %}

{% include components/platform_content.html content_dir='getting-started-config' %}

{% endwizard %}

## Capturing your first event

Once you have Sentry integrated into your project, you probably want to verify that everything is working as expected before deploying it.

{% wizard %}
{% include components/platform_content.html content_dir='getting-started-verify' %}
{% endwizard %}

## Next Steps

Now that you’ve got basic reporting set up, you’ll want to explore adding additional context to your data.

{% include components/platform_content.html content_dir='getting-started-next-steps' %}
-   [_manual error and event capturing_](/error-reporting/capturing/)
-   [_configuration options_](/error-reporting/configuration/)
-   [_adding context (tags, user and extra information)_](/enriching-error-data/additional-data/)
-   [_tracing issues with breadcrumbs_](/enriching-error-data/breadcrumbs/)
-   [_capturing user feedback on crashes_](/enriching-error-data/user-feedback/)
