---
title: Heroku
sidebar_order: 2
---

Sentry provides a native add-on for Heroku. While this add-on is not required, it will allow you to maintain consolidated billing inside of Heroku, as well as enable easy configuration of your Sentry credentials.

## Register the Add-on

To add Sentry to an existing Heroku app, head over to the [Sentry Heroku add-on](https://elements.heroku.com/addons/sentry) page.

Once done, you’ll be able to confirm that Sentry’s credentials are available via your config:

```sh
heroku config:get SENTRY_DSN
```

{% capture __alert_content -%}
If you’re not using the add-on, you can still bind the `SENTRY_DSN` environment variable which the SDK will automatically pick up.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

## Install the SDK

Whether you’re using the add-on or not, you’ll still need to install the SDK per our standard platform-specific instructions.

{% include LEGACY_platform_icon_links.html %}

## Configure Releases

Whether use the add-on or configure Sentry yourself, you’ll also likely want to grant quick access to your dyno metadata, which will allow Sentry to automatically pick up the git version of your application.

To do this, enable the `runtime-dyno-metadata` feature:

```sh
heroku labs:enable runtime-dyno-metadata -a <app name>
```

This exposes the `HEROKU_SLUG_COMMIT` environment variable, which most Sentry SDKs will automatically detect and use for configuration.

Next you’ll want to add your repository and setup a deploy hook.

1.  Start by connecting your repository to your Sentry organization so that we can automatically retrieve your commit data.

    [{% asset add-repo.png %}]({% asset add-repo.png @path %})
    
2.  Enable the Heroku integration in your Sentry Project Settings.

    [{% asset enable-heroku.png %}]({% asset enable-heroku.png @path %})
    
3.  In the Heroku Plugin Configuration, specify which repository and deploy environment to be associated with your Sentry project.

    [{% asset heroku-project-config.png %}]({% asset heroku-project-config.png @path %})
    
4.  Navigate to your Project’s Release Tracking settings and copy the deploy hook command to your Heroku config.

    [{% asset heroku-config.png %}]({% asset heroku-config.png @path %})

You’ll start getting rich commit information and deploy emails with each new release, as well as tracking of which release issues were seen within.
