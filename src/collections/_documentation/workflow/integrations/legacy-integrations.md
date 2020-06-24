---
title: Per-Project Integrations
sidebar_order: 1
---

These integrations are set up once per project, and are only usable in projects in which they've been set up.

{% include components/alert.html
  title="Community Integrations"
  content="These integrations are [maintained and supported](https://forum.sentry.io) by the Sentry community. Documentation is available for a few community created integrations such as Asana, Heroku, Hipchat, and Splunk. Other community created integrations are available for installation in Sentry and will receive documentation in due time."
  level="info"
%}

## Issue Management

Issue tracking allows you to create issues from within Sentry, and link Sentry issues to existing supported integration Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link issues. 

### Asana

#### Asana Issue Creation from Sentry

Create or link issues in Asana based on Sentry events.

1. Go to the project settings page in Sentry that you’d like to link with Asana
2. Click All Integrations, find the Asana integration in the list, and click configure
3. Click Enable Plugin
4. Link your Asana account and select an organization or workspace
5. The option to create or link Asana issues will be displayed from your Sentry issue pagess

### More Integrations

-   Lighthouse*
-   Phabricator
-   Pivotal Tracker
-   Redmine
-   Taiga
-   Teamwork
-   Trello*

## Issue Notifications

Alert notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. You will need to configure a project’s [**Alert Rules**](/workflow/alerts-notifications/alerts/) to properly route notifications to a specific integration.

### Hipchat

Get HipChat notifications for Sentry issues.

1. Go to the project settings page in Sentry that you’d like to link with HipChat
2. Click All Integrations, find the HipChat integration in the list, and click configure
3. Click Enable Plugin
4. Click the Enable Integration link OR add the integration through the HipChat Marketplace
5. Log in to HipChat and specify which HipChat room you would like to send Sentry issues to
6. Follow the Sentry configuration flow and select the organizations and projects you would like notifications for
7. Sentry issues will appear in your HipChat room as they occur depending on the alert rules you have specified in your project settings

### More Integrations

-   Campfire*
-   Flowdock
-   OpsGenie
-   PagerDuty
-   Pushover
-   Twilio

## Additional Integrations

### Amazon SQS

This is commonly useful in places where you may want to do deeper analysis on exceptions, or empower other teams, such as a Business Intelligence function.

Configuring Data Forwarding is done by visiting **[Project] » Settings » Data Forwarding** and filling in the required information for the given integration.

Integration with Amazon SQS makes it quick and easy to pipe exceptions back into your own systems.

The payload for Amazon is identical is our standard API event payload, and will evolve over time. For more details on the format of this data, see our [API documentation](/api/events/get-project-event-details/).

### Heroku

Sentry provides a native add-on for Heroku. While this add-on is not required, it will allow you to maintain consolidated billing inside of Heroku, as well as enable easy configuration of your Sentry credentials.

#### Register the Add-on

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

#### Install the SDK

Whether you’re using the add-on or not, you’ll still need to install the SDK per our standard platform-specific instructions.

{% include LEGACY_platform_icon_links.html %}

#### Configure Releases

Whether use the add-on or configure Sentry yourself, you’ll also likely want to grant quick access to your dyno metadata, which will allow Sentry to automatically pick up the git version of your application.

To do this, enable the `runtime-dyno-metadata` feature:

```sh
heroku labs:enable runtime-dyno-metadata -a <app name>
```

This exposes the `HEROKU_SLUG_COMMIT` environment variable, which most Sentry SDKs will automatically detect and use for configuration.

Next, you’ll want to add your repository and set up a deploy hook:

1.  Start by connecting your repository to your Sentry organization so we automatically retrieve your commit data. Find your repository integration (GitHub, GitLab, Bitbucket, for example) in **Settings > Integrations**. From the Configurations tab, click "Configure".

    [{% asset heroku-configure-repo-integration.png %}]({% asset heroku-configure-repo-integration.png @path %})
    
    On the Configure page, click "Add Repository" then select the repository you want to use.
    
    [{% asset heroku-repo-add.png %}]({% asset heroku-repo-add.png @path %})
2.  Find the Heroku integration in **Settings > Integrations**, and click "Add to Project" then select the project you want to use with Heroku.

    [{% asset heroku-integration-detail.png %}]({% asset heroku-integration-detail.png @path %})
    
3.  In the Heroku integration configuration, specify which repository and deploy environment to be associated with your Sentry project.

    [{% asset heroku-project-config.png %}]({% asset heroku-project-config.png @path %})
    
4.  Navigate to your project’s Release settings and copy the deploy hook command to your Heroku config.

    [{% asset heroku-config.png %}]({% asset heroku-config.png @path %})

You’ll start getting rich commit information and deploy emails with each new release, as well as tracking of which release issues were seen within.

### Splunk

Connect Splunk to Sentry with the [Data Forwarding](/data-management/data-forwarding/) feature.

{% capture __alert_content -%}
We only support Splunk Cloud plans. We do not support Splunk Enterprise plans.

See the [Splunk documentation](http://dev.splunk.com/view/event-collector/SP-CAAAE7F) for specific details on your Splunk installation.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

#### Enabling HEC

To get started, you’ll need to first enable the HTTP Event Collector:

Under **Settings**, select **Data Inputs**:

[{% asset splunk-settings.png %}]({% asset splunk-settings.png @path %})

Select **HTTP Event Collector** under Local Inputs:

[{% asset splunk-data-inputs.png %}]({% asset splunk-data-inputs.png @path %})

Under your HEC settings, click **Global Settings**:

[{% asset splunk-hec-inputs.png %}]({% asset splunk-hec-inputs.png @path %})

Change **All Tokens** to **Enabled**, and note the HTTP Port Number (`8088` by default):

[{% asset splunk-hec-global-settings.png %}]({% asset splunk-hec-global-settings.png @path %})

{% capture __alert_content -%}
If you’re running Splunk in a privileged environment, you may need to expose the HEC port.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

#### Creating a Sentry Input

Under HTTP Event Collector, create a new Sentry input by clicking **New Token**:

[{% asset splunk-new-http-input.png %}]({% asset splunk-new-http-input.png @path %})

Enter a name (e.g. `Sentry`), and click **Next**:

[{% asset splunk-new-input-name.png %}]({% asset splunk-new-input-name.png @path %})

Select the index you wish to make accessible (e.g. `main`), and click **Review**:

[{% asset splunk-new-input-index.png %}]({% asset splunk-new-input-index.png @path %})

You’ll be prompted to review the input details. Click **Submit** to continue:

[{% asset splunk-new-input-review.png %}]({% asset splunk-new-input-review.png @path %})

The input has now been created, and you should be presented with the **Token Value**:

[{% asset splunk-new-input-final.png %}]({% asset splunk-new-input-final.png @path %})

#### Enabling Splunk Forwarding

To enable Splunk forwarding, you’ll need the following:

-   Your instance URL (see note below)
-   The Sentry HEC token value

In Sentry, navigate to the project you want to forward events from, and click **Project Settings**:

[{% asset project-settings-link.png %}]({% asset project-settings-link.png @path %})

Navigate to **Data Forwarding**, and enable the Splunk integration:

{% asset splunk-data-forwarding-setting.png %}

Your instance URL is going to vary based on the type of Splunk service you’re using. If you’re using self-service Splunk Cloud, the instance URL will use the `input` prefix:

```
https://input-<host>:8088
```

For all other Splunk Cloud plans, you’ll use the `http-inputs` prefix:

```
https://http-inputs-<host>:8088
```

If you’re using Splunk behind your firewall, you’ll need to fill in the appropriate host.

Once you’ve filled in the required fields, hit **Save Changes**:

[{% asset splunk-data-forwarding-setting-complete.png %}]({% asset splunk-data-forwarding-setting-complete.png @path %})

We’ll now begin forwarding all new events into your Splunk instance.

{% capture __alert_content -%}
Sentry will internally limit the maximum number of events sent to your Splunk instance to 50 per second.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

[{% asset splunk-search-sentry.png %}]({% asset splunk-search-sentry.png @path %})
