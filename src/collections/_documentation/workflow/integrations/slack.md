---
title: Slack
sidebar_order: 10
---

The global Slack integration creates workflows for your team. Now you can triage, resolve, and ignore Sentry issues directly from Slack.

## Configure Slack

{% capture __alert_content -%}
Sentry owner or manager permissions are required to install this integration. Slack defaults to let any workspace member authorize apps, but they may have to request access. See this [Slack help article](https://get.slack.help/hc/en-us/articles/202035138-Add-an-app-to-your-workspace) for more details.

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.

1. At the top of the page, you’ll see the available Global Integrations list, which includes Slack. Click **Install** to integrate Sentry with your Slack workspace(s).

    [{% asset slack-all-integrations-page.png %}]({% asset slack-all-integrations-page.png @path %})

1. Click **Add workspace**.

    [{% asset slack-auth-choose-workspace.png %}]({% asset slack-auth-choose-workspace.png @path %})

    {% capture __alert_content -%}
    You can toggle the Slack workspace you want to connect in the dropdown menu in the upper right corner of the authentication window. To set up multiple workspaces, go through this process for each separate workspace.
    {%- endcapture -%}
    {%- include components/alert.html
      title="Note"
      content=__alert_content
      level="info"
    %}

1. After you've connected to the correct workspace, click **Continue**.

1. On the next page, you can choose the scope of channels you’d like Sentry to access. You can specify all public channels or choose specific channels. Then click **Install**.

    [{% asset slack-auth-channel-pref.png %}]({% asset slack-auth-channel-pref.png @path %})

1. Your Organization Integrations page will refresh and show the Slack workspace you just added.

    [{% asset slack-add-workspace-success.png %}]({% asset slack-add-workspace-success.png @path %})

    You’ll also see the Sentry app join the Slack channels you specified right away.

    [{% asset slack-sentry-integration-in-channel.png %}]({% asset slack-sentry-integration-in-channel.png @path %})

Now your Slack integration is available to all projects in your Sentry organization. See the next section to configure your notification settings.

## Configure Alert Rules

1. Confirm your Slack workspace is configured globally for your Sentry organization by navigating to Organization Settings > **Integrations**.

    [{% asset slack-add-workspace-success.png %}]({% asset slack-add-workspace-success.png @path %})

1. Click **Configure** and you’ll see the available Slack workspaces for your project. From this page, you can click on **Add Alert Rule** for this project to go directly to your Alert Rule settings.

    [{% asset slack-global-integration-project-settings-add-alert.png %}]({% asset slack-global-integration-project-settings-add-alert.png @path %})

    You can also access **Alerts** from your **Project Settings**. From here, you can configure when notifications are sent to your Slack workspace(s).
    
    {% capture __alert_content -%}
    You can route notifications in a few ways: to a specific channel in your Slack workspace, to multiple channels in your Slack workspace, or to multiple Slack workspaces.
    {%- endcapture -%}
    {%- include components/alert.html
      title="Note"
      content=__alert_content
      level="info"
    %}

1. Click **New Alert Rule** to configure a new Alert. 

    [{% asset slack-alert-rules.png %}]({% asset slack-alert-rules.png @path %})

    For any existing Alert Rules, you can edit the rule to update the Slack channel routing. When you click **Edit Rule**, under **Take these actions** you can specify your Slack channel(s):

    [{% asset slack-alert-rule-edit.png %}]({% asset slack-alert-rule-edit.png @path %})

    After selecting **Send a notification to the {workspace} Slack workspace to {channel} and include tags {tags}**, you can specify the workspace, channel(s), and tags you’d like to include with your Alert Rule.

    [{% asset slack-alert-rule-for-one-workspace.png %}]({% asset slack-alert-rule-for-one-workspace.png @path %})

    You can add Alert Rules routing to as many Slack channels as you’d like.

1. Then once you receive a Slack notification, you can use the Resolve, Ignore, or Assign buttons to update the Issue in Sentry.

    [{% asset slack-alert-message.png %}]({% asset slack-alert-message.png @path %})

## Deleting the legacy Slack integration

Once you configure the global Slack integration and Alert Rules, you can disable the old Slack integration. You’ll need to go to each project that has it enabled and disable it. We recommend disabling the legacy integration after setting up the global integration.
