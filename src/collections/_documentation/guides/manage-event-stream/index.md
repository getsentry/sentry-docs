---
title: Manage your Event Stream
sidebar_order: 2
---

Getting started with Sentry error monitoring is pretty straightforward - create a Sentry project, install and initialize the Sentry SDK in your code and you're ready to go.
 <!--
 For more information take a look at the [Getting Started](https://docs.sentry.io/error-reporting/quickstart/?platform=browser) section in our documentation.
 -->

 Once completed, **any** Exception, Runtime Error or Crash that occurs **wherever** and **whenever** your code is running, will be aggregated in your Sentry Event and Issue Streams. Depending on your use case, your stream might be aggregating millions of events in no time.
 
Sending all your errors to Sentry is generally a good practice. This ensures greater visibility into your application code's health and performance. However, with just this basic setup in place, you might risk:

1. Flooding your event stream with redundant noise such as errors from 3rd party libraries, errors from unstable versions of your code etc.
2. Getting spammed with alert notifications about things you don't care about or worst - loose track of the real important issues that are hiding in your code. 

Filtering this noise will help ensure that you only see the relevant errors that you want or need to fix. In addition, if you're on an event-quota based planned, redundant noise might end up draining your quota and leaving you blind when and where it matters.

To cope with these challenges, Sentry provides several mechanisms that allow you to control the _type_ and _amount_ of events that make it to your event stream.
<!-- 
Applying these mechanisms is usually done in an iterative mode, where you gradually learn to fine-tune them to optimize your visibility and overall health. In the following sections will go over these mechanisms and then finally see how to leverage Sentry's Discover view to apply them on your Sentry set up.
-->

## 1. Filtering

Using Sentry filtering options is the optimal way to manage your event stream. They allow you to prevent Sentry from storing events in certain conditions, clear your event and issue streams from undesired "noise", and keep your event quota in-tact and your visibility high.

### Outbound Filters

The Sentry SDk has various configuration options, several of which can and should be used to filter unwanted errors from reaching your Sentry account. By default, all errors will be sent. Those include:

- `whitelistUrls`:  A whitelist of domains which might raise acceptable exceptions represented in regex pattern format.
- `blacklistUrls`:  A list of strings or regex patterns that match error URLs which should be blocked from sending events to your Sentry account.
- `ignoreErrors`: Instruct the SDK to never send an error to Sentry if it matches any of the listed exception messages. (Only available in the JavaScript SDK)

    > For more information and code samples checkout - [Integrating the SDK: Decluttering Sentry](https://docs.sentry.io/platforms/javascript/#decluttering-sentry)

- `beforeSend`: The unified Sentry SDK provides a callback method that is invoked before an event is sent from your code runtime to Sentry with the event object passed to it as parameter. Developers can hook into this callback to modify the event or drop it (filter) completely by returning `null`. Developers can apply their custom internal logic to filter outgoing events leveraging additional data available on the SDK and event object like default and custom tags, environment, release version, error attributes, etc.

    > For more information checkout
    >
    > - [Filtering Events](https://docs.sentry.io/error-reporting/configuration/filtering)
    > - [Enriching Error Data](https://docs.sentry.io/enriching-error-data/context/?platform=browser)

<!--

```JavaScript
    Sentry.init({
      dsn: '<Your DSN Key>',
      release: '<%= version %>',
      environment: '<%= environment %>',
      whitelistUrls: [/our-domain\.com/, /their-domain\.com/],
      blacklistUrls: [
        /\/\/apapi\./,          <%# https://apapi.dc121677.com/ad %>
        /\.flashtalking\.com/,  <%# https://cdn.flashtalking.com/xre/390/3908512/2632055/js/j-3908512-2632055.js %>
        /\/\/media.ascend.ai/,  <%# https://media.ascend.ai/c/263109871-1/ascend.js %>
        'https://www.googletagservices.com/activeview/js/current/osd_listener.js'
      ],
      ignoreErrors: ['TypeError'],
      beforeSend: <%- include('sentry-before-send') %>
    });
```

--> 

### Inbound Filters

While using outbound filters requires changes to your source code and applying them depend on your next deployment, Inbound Filters (or server-side filters) can be easily configured in your Sentry account under `[Project Settings] > Inbound Filters > Data Filters`.

These include configurations to filter out

- Errors known to be caused by **browser extensions**
- Events coming from **localhost**
- Known **legacy browsers** errors
- Errors caused ny known **web crawlers** crawling your site

![Built-in Inbound Filters]({% asset guides/manage-event-stream/01.png @path %})

Those also include custom filters to filter out errors

- By their **error message**
- From specific **release versions** of your code
- From certain **IP addresses**

![Custom Inbound Filters]({% asset guides/manage-event-stream/02.png @path %})

Once applied, you can track the amount of filtered errors using the graph provided at the top of the Inbound Data Filters view.

![Built-in Inbound Filters]({% asset guides/manage-event-stream/03.png @path %})

> For more information on inbound filtering options take a look at:
>
> - [Inbound Filters](https://docs.sentry.io/accounts/quotas/#inbound-data-filters) in our docs section
> - [Manage Your Flow of Errors Using Inbound Filters](https://blog.sentry.io/2017/11/27/setting-up-inbound-filters)

## 2. Event Grouping

Any event that makes it from your source code runtime though the outbound and inbound filters will be persisted and available in your Sentry account's Event Stream. **Similar _Events_ are grouped together into unique _Issues_ based on an event's _Fingerprint_**. An event's fingerprint (and proper grouping) relies on it's **Stacktrace**. If a stacktrace is not available, fingerprint will be determined by the type and value of the **Exception** associated with this event. If all else fails, fingerprint will default to the event **Message**.

Sentry provides various configuration options to modify and fine tune event grouping. For more information take a look at our docs on[Grouping & Fingerprints](https://docs.sentry.io/data-management/event-grouping/).

### Optimize your Event Grouping

Proper grouping of events into issues is essential for maintaining a meaningful Issue Stream, gaining accurate visibility into the health of your application code and leveraging Sentry workflows and integrations in a meaningful way. To make sure your events are grouped properly:

1. With our various **Javascript SDKs**, minimized source code will result in a nondeterministic stacktrace that will mess up associated event grouping. Make sure Sentry has access to your Source Maps and minimized artifacts. For more information take a look at our documentation on [Uploading Source Maps](https://docs.sentry.io/platforms/javascript/#source-maps).

![JavaScript stacktrace without source maps]({% asset guides/manage-event-stream/04.png @path %})

![JavaScript stacktrace with source maps]({% asset guides/manage-event-stream/05.png @path %})

2. Similarly, projects using the Sentry **Native SDK** should provide debug information, which allows Sentry to extract stacktraces and symbolicate stack frames into function names and line numbers. For more information take a look at the following resources:

- [Fixing Native Apps with Sentry](https://blog.sentry.io/2019/09/26/fixing-native-apps-with-sentry/)
- [Sentry Native SDK](https://docs.sentry.io/platforms/native/)
- [Debug Information Files](https://docs.sentry.io/workflow/debug-files/#source-context)

## 3. Applying Workflows

### Resolve Issue

The Sentry Workflow — Resolve
https://blog.sentry.io/2019/07/03/the-sentry-workflow-resolve`

### Delete & Discard

Delete and Discard:
https://blog.sentry.io/2019/04/11/5-sentry-settings-problems-to-solve#managing-your-quota 

https://blog.sentry.io/2018/01/03/delete-and-discard

## 4. Rate Limiting

### Spike Protection

Spike protection helps prevent huge overages from consuming your event capacity. Check out our documentation on [Spike Protection](https://docs.sentry.io/accounts/quotas/#spike-protection)

The final option we recommend for quota management is spike protection, which helps prevent huge overages from consuming your event capacity. If it really is a spike (large and temporary increase in event volume), spike protection drops events during the spike to try and conserve your capacity. We also send an email notification to the Owner when spike protection is activated.

### Limiting by DSN Key

## Workflow: Managing your Stream

Applying filters and rate limits is an iterative on-going process.
