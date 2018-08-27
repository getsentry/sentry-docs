---
title: Splunk
sidebar_order: 8
---

Connect Splunk to Sentry with the [Data Forwarding]({%- link _documentation/learn/data-forwarding.md -%}) feature.

{% capture __alert_content -%}
See the [Splunk documentation](http://dev.splunk.com/view/event-collector/SP-CAAAE7F) for specific details on your Splunk installation.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Enabling HEC

To get started, you’ll need to first eanble the HTTP Event Collector:

Under **Settings**, select **Data Inputs**:

{% asset splunk-settings.png %}

Select **HTTP Event Collector** under Local Inputs:

{% asset splunk-data-inputs.png %}

Under your HEC settings, click **Global Settings**:

{% asset splunk-hec-inputs.png %}

Change “All Tokens” to “Enabled”, and note the HTTP Port Number (`8088` by default):

{% asset splunk-hec-global-settings.png %}{% capture __alert_content -%}
If you’re running Splunk in a privileged environment, you may need to expose the HEC port.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Creating a Sentry Input

Under HTTP Event Collector,create a new Sentry input by clicking “New Token”:

{% asset splunk-new-http-input.png %}

Enter a name (e.g. `Sentry`), and click “Next”:

{% asset splunk-new-input-name.png %}

Select the index you wish to make accessible (e.g. `main`), and click “Review”:

{% asset splunk-new-input-index.png %}

You’ll be prompted to review the input details. Click “Submit” to continue:

{% asset splunk-new-input-review.png %}

The input has now been created, and you should be presented with the **Token Value**:

{% asset splunk-new-input-final.png %}

## Enabling Splunk Forwarding

To enable Splunk forwarding, you’ll need the following:

-   Your instance URL (see note below)
-   The Sentry HEC token value

In Sentry, navigate to the project you want to forward events from, and click “Project Settings”:

{% asset project-settings-link.png %}

Navigate to “Data Forwarding”, and enable the Splunk integration:

{% asset splunk-data-forwarding-setting.png %}

You’re instance URL is going to vary based on the type of Splunk service you’re using. If you’re using self-service Splunk Cloud, the instance URL will use the `input` prefix:

```
https://input-<host>:8088
```

For all other Splunk Cloud plans, you’ll use the `http-inputs` prefix:

```
https://http-inputs-<host>:8088
```

If you’re using Splunk behind your firewall, you’ll need to fill in the appropriate host.

Once you’ve filled in the required fields, hit “Save Changes”:

{% asset splunk-data-forwarding-setting-complete.png %}

We’ll now begin forwarding all new events into your Splunk instance.

{% capture __alert_content -%}
Sentry will internally limit the maximum number of events sent to your Splunk instance to 50 per second.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}{% asset splunk-search-sentry.png %}
