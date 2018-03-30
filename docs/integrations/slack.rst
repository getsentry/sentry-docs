Slack
======

.. note:: The new Slack integration is only available for Sentry's early adopters -- you can enable early adopters in your **Organization Settings** under **General**.

Sentry's new Slack integration creates workflows for your team, instead of a notification stream. Now you can triage, resolve, and ignore issues directly from Slack.

Configure Slack
---------------

You can authorize the Slack integration globally by clicking on **All Integrations** under your **Project settings**.

.. note:: We're planning to move more legacy integrations to this style of Global Integrations soon. In the future, your Global Integrations will live in your Organization settings.

At the top of the page, you'll see the available Global Integrations list, which includes Slack. Click **Configure** to integrate your Slack workspace(s) with your project.

    .. image:: img/slack-all-integrations-page.png
       :width: 70%

Click **Add workspace**:

    .. image:: img/slack-global-integration-project-settings-add-workspace.png
       :width: 70%

A new window will open to connect your Slack workspace with Sentry:

    .. image:: img/slack-auth-choose-workspace.png
       :width: 70%

*Slack defaults to let any member of your workspace authorize apps, but you may have to request access, see this `Slack help article <https://get.slack.help/hc/en-us/articles/202035138-Add-an-app-to-your-workspace> for more details`.*

.. note:: You can toggle the Slack workspace you want to connect in the dropdown menu in the upper right corner of the authentication window. To set up multiple workspaces, go through this process for each separate workspace.

After you ensure you're connecting the correct workspace, click **Continue**.

On the next page, you can choose the scope of channels you'd like Sentry to access. You can specify all public channels or choose specific channels.

    .. image:: img/slack-auth-channel-pref.png
       :width: 60%

Click **Authorize**.

Your Project Integrations page will refresh and show the Slack workspace you just added.

    .. image:: img/slack-add-workspace-success.png
       :width: 70%

You'll also see the Sentry app join the Slack channels you specified right away:

    .. image:: img/slack-sentry-integration-in-channel.png
       :width: 60%

Now your Slack integration is available to all projects in your Sentry organization! See the next section on the steps to configure your notification settings.


Configure Alert Rules for specific Slack channels
-------------------------------------------------

Confirm your Slack workspace is configured globally for your Sentry organization by clicking on **All Integrations** from your **Project Settings**

    .. image:: img/slack-all-integrations-page.png
       :width: 70%

Click **Configure** and you'll see the available Slack workspaces for your project. From this page, you can click on **Add an Alert Rule for this project** to go directly to your Alert Rule settings.

    .. image:: img/slack-global-integration-project-settings-add-alert.png
       :width: 70%

You can also access **Alerts** from your **Project Settings**. There, you can configure when notifications are sent to your Slack workspace(s). You can route notifications in a few ways:

1. To a specific channel in your Slack workspace
2. To multiple channels in your Slack workspace
3. To multiple Slack workspaces

Click **New Alert Rule** to configure a new Alert.

For any existing Alert Rules you previously configured, you can edit the rule to update the Slack channel routing:

    .. image:: img/slack-alert-rules.png
       :width: 70%

When you click **Edit Rule**, under **Take these actions** you can specify your Slack channel(s):

    .. image:: img/slack-alert-rule-edit.png
      :width: 70%

After selecting **Send a notification to the {workspace} Slack workspace to {channel} and include tags {tags}**, you can specify the workspace, channel(s), and tags you'd like to include with your Alert Rule.

    .. image:: img/slack-alert-rule-for-one-workspace.png
       :width: 70%

You can add Alert Rules routing to as many Slack channels as you'd like!

From the Slack notification, you can use the Resolve, Ignore, or Assign buttons to update the Issue in Sentry.

    .. image:: img/slack-alert-message.png
       :width: 70%

Deleting the legacy Slack integration
-------------------------------------

Once you configure the global Slack integration and Alert Rules, you can disable the old Slack integration. You'll need to go to each project that has it enabled and disable it. We recommend disabling the legacy integration after setting up the new Global Integration for Slack.
