---
title: Manage your Event Stream
sidebar_order: 2
---

Getting started with Sentry error monitoring is pretty straightforward - create a Sentry project, install and initialize the Sentry SDK in your code and you're ready to go. Once completed, **any** Exception, Runtime Error or Crash that occurs **wherever** and **whenever** your code is running, will be aggregated in your `Event Stream`. Depending on your portfolio, your stream might be aggregating millions of events in no time. Sending all your errors to Sentry is generally a good practice. This ensures greater visibility into the health and performance of your application code. However, with just this basic setup in place, you might risk:

1. Flooding your event stream with redundant noise such as errors from 3rd party libraries, errors from unstable versions of your code, etc.
2. Getting spammed with alert notifications about things you don't care about or worst - lose track of the important issues that are hiding in your code.

Filtering this noise will help ensure that you only see the relevant errors that you want or need to fix. Also, if you're on an event-quota based plan, redundant noise might end up draining your quota and leaving you blind when and where it matters.

To cope with these challenges, Sentry provides several mechanisms that allow you to control the _type_ and _amount_ of events that make it to your event stream.

## 1. Filtering

Filtering is the optimal way to manage your event stream and quota. It ensures that only actionable errors related to your source code make it to your event stream.  If it's redundant, filter it - clear your event stream from undesired "noise", and keep your alert notifications for the errors that matter.

### Outbound Filters

Sentry SDK has several configuration options that can be used to filter unwanted errors from reaching your account. By default, all errors will be sent. Those include:

- `beforeSend`: A callback method invoked before an event is sent from your code runtime to Sentry with the event object passed to it as parameter. Developers can hook into this callback to modify the event or drop it (filter) completely by returning `null`. Filter outgoing events based custom logic and data available on the SDK and event object like _tags_, _environment_, _release version_, _error attributes_, etc.

For JavaScript SDKs:

- `whitelistUrls`:  Domains that might raise acceptable exceptions represented in regex pattern format.
- `blacklistUrls`:  A list of strings or regex patterns that match error URLs which should be blocked from sending events.
    > **Note**: Configuring both options on the SDK can be used to blacklist **subdomains** of the domains listed in whitelistUrls.
- `ignoreErrors`: Instruct the SDK to never send an error to Sentry if it matches any of the listed error **messages**. If no message is available, the SDK will try to compare against an underlying **exception type and value**.

For more information and code samples checkout:

- [Integrating the SDK: Decluttering Sentry](https://docs.sentry.io/platforms/javascript/#decluttering-sentry)
- [Filtering Events](https://docs.sentry.io/error-reporting/configuration/filtering)
- [Enriching Error Data](https://docs.sentry.io/enriching-error-data/context/?platform=browser)

### Inbound Data Filters

While using outbound filters requires changes to your source code and applying them depend on your next deployment, Inbound Filters (or server-side filters) can be easily configured in your Sentry account under `[Project Settings] > Inbound Filters > Data Filters`.

These include predefined configurations to filter out

- Common **browser extensions** errors
- Events coming from **localhost**
- Known **legacy browsers** errors
- Errors caused by known **web crawlers** crawling your site

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
> - [Inbound Filters](https://docs.sentry.io/accounts/quotas/#inbound-data-filters)
> - [Manage Your Flow of Errors Using Inbound Filters](https://blog.sentry.io/2017/11/27/setting-up-inbound-filters)

## 2. Event Grouping

Any event that makes it from your source code runtime though the outbound and inbound filters will be persisted and available in your Event Stream. **Similar _Events_ are grouped into unique _Issues_ based on the event's _Fingerprint_**. An event's fingerprint (and proper grouping) relies on its **stack-trace**. If a stack-trace is not available, the fingerprint will be determined by the type and value of the **Exception** associated with this event. If all else fails, fingerprint will default to the **Event Message**.

Sentry provides various configuration options to modify and fine-tune event grouping. For more information take a look at our docs on [Grouping & Fingerprints](https://docs.sentry.io/data-management/event-grouping/).

### Optimize your Event Grouping

Proper grouping of events into issues is essential for maintaining a meaningful Issue Stream, gaining accurate visibility into the health of your application code and leveraging Sentry workflows and integrations in a meaningful way. To make sure your events are grouped properly:

1. With **JavaScript SDKs**, a minimized source code will result in a nondeterministic stack-trace that will mess up associated event grouping. Make sure Sentry has access to your Source Maps and minimized artifacts. For more information take a look at our documentation on [Uploading Source Maps](https://docs.sentry.io/platforms/javascript/#source-maps).

    ![JavaScript stack-trace without source maps]({% asset guides/manage-event-stream/04.png @path %})
    ![JavaScript stack-trace with source maps]({% asset guides/manage-event-stream/05.png @path %})

2. Similarly, projects using the Sentry **Native SDK** should provide debug information, which allows Sentry to extract stack-traces and symbolicate stack frames into function names and line numbers. For more information take a look at the following resources:

- [Fixing Native Apps with Sentry](https://blog.sentry.io/2019/09/26/fixing-native-apps-with-sentry/)
- [Sentry Native SDK](https://docs.sentry.io/platforms/native/)
- [Debug Information Files](https://docs.sentry.io/workflow/debug-files/#source-context)

## 3. Applying Workflows

Now that your event stream is fine-tuned to reflect real problems in your code, its a good practice to react to errors as they happen. If an issue reflects a real problem in your code - resolve it, otherwise - discard.

### Resolve Issue

You've been alerted on a new error in your code? Jump into the issue page to see all the data you need to know about the issue. If its a real error in your code, assign a team member to resolve it. Don't forget to let Sentry now once it's resolved.

For more information take a look at [The Sentry Workflow — Resolve](https://blog.sentry.io/2019/07/03/the-sentry-workflow-resolve)

### Delete & Discard

If there is an irrelevant reoccurring issue that you are unable or unwilling to resolve, you can delete and discard it from the issue details page by clicking `Delete and discard future events`. This will delete the issue and event data from Sentry and filter out matching events before they reach your stream.

![Delete and Discard]({% asset guides/manage-event-stream/06.png @path %})

Discarded issues are listed under `[Project Settings] > Inbound Filters > Discarded Issues` and can always be un-discarded to allow future events back in your stream.

![List of Discarded Issues]({% asset guides/manage-event-stream/07.png @path %})

> Note: Once you've identified a set of discarded issues, it might make sense to go back to your SDK configuration and add the related errors into your before-send client-side filtering.

## 4. Rate Limiting

Rate limiting allows you to limit the amount of events Sentry accepts per project for a defined period - minutes, hours, day. While this is quite useful for managing your monthly event quota, keep in mind that once a defined threshold is crossed - **subsequent events will be dropped**. Therefore, your rate limit shouldn't be constantly hit, but rather defined as a ceiling intended to protect you from unexpected spikes that might drain your monthly quota and leave you in the dark for a while.

Under `[Project Settings] » Client Keys » Configure` you can create multiple keys per project and assign different (or no) limits to each key. This will allow you to dynamically allocate keys (with varying threshold) depending on Release, Environment, etc.

![Per DSN Key rate limits]({% asset guides/manage-event-stream/11.png @path %})

For more information: [Rate Limiting Projects](https://docs.sentry.io/accounts/quotas/#id1)

### Spike Protection

Sentry also applies a dynamic rate limit to your account designed to protect you from short-term spikes. However, we would recommend applying all of the previously mentioned methods. For more information:

- [Spike Protection](https://docs.sentry.io/accounts/quotas/#spike-protection)
- [Protect Yourself Against Spikes in Events with Spike Protection](https://blog.sentry.io/2018/05/08/event-spike-protection#what-counts-as-a-spike)

***

## Workflows for Managing your Event Stream

Applying the proper filters, SDK configuration and rate limits is an iterative and on-going process. Sentry provides several tools to increase your visibility into the events and issues aggregating in your streams. Let's see how they can be leveraged to manage your streams.

### > **How can I see a breakdown of incoming events?**

Opening the `Stats` view from the left side navigation bar displays details about the total number of events Sentry has received across your entire organization.  The numerical weekly report breaks down the events by project into three categories:

- **Accepted**: events processed and persisted displayed in your event and issue streams.
- **Rate Limited**: events that Sentry threw away due to quotas being hit
- **Filtered**: events that were blocked based on your inbound filter rules.

![STATS View]({% asset guides/manage-event-stream/12.png @path %})

Clicking on a project name will open the project settings view where you can manage the project's Inbound Filtering and Rate Limiting.

### > **What are my busiest projects?**

The [Discover](https://docs.sentry.io/workflow/discover/) view provides a flexible query builder to query event data cross-project. Queries are executed against a subset of events defined in the **top-level filter bar** based on selected _projects_ and _date range_.

> NOTE: The Projects drop-down allows you to search for events across
>
> - **My Projects:** all projects that you are assigned to via team-membership within the organization
> - **All Projects:** all projects within the organization (requires owner permission role)
> - **Subset** of selected projects
>
>   ![Project Filter]({% asset guides/manage-event-stream/17.png @path %})

- Navigate to the Discover view
- From the top-level filter bar select `View All Projects` from the project drop-down and apply the desired date range
- Build, Run, and Save the following query

    ![Busiest Projects]({% asset guides/manage-event-stream/16.png @path %})

### > **How to set proper rate limits?**

A good way to set a project rate limit is by figuring out the expected event volume based on past traffic. Let's look at an example

![Calculating rate limits]({% asset guides/manage-event-stream/14.png @path %})

- Open the project DSN key configuration under `[Project Settings] > Client Keys > [Configure]`
- Take a look at the `KEY USAGE IN THE LAST 30 DAYS` graph. Max daily rate in the last month is < 326K
- Based on that, we can define a ceiling **daily** max value of ~330K which is ~13,750 events an **hour**.
- Notice that you can set a daily, hourly or minute-based rate limit. We'd recommend using an hourly rate to avoid situations where a random event spike might exhaust your daily set quota and leave you blind for the rest of the day.
- You can always go back, check the graph to see the number of events dropped due to rate limiting and revisit your settings.

    ![Revisit rate limits]({% asset guides/manage-event-stream/15.png @path %})

### > **Spike Protection was activated - what should I do?**

You received an email notifying you that Spike Protection was triggered and applied to your account.

![Spike Protection Email]({% asset guides/manage-event-stream/spike-email.jpg @path %})

Consider doing the following:

- Setting better rate limits on that project's DSN key.
- If a specific error was blowing up - resolve or discard it.
- If it's a specific Release version that's gone bad - add the version Id to the project's Inbound filters to avoid additional errors from that release.

### > **What issues are consuming my quota?**

- Navigate to the Discover view
- From the top-level filter bar select `View All Projects` from the project drop-down and apply the desired date range
- Build, Run, and Save the following query
- Notice that you can open an issue details page by clicking on the `issue id` link

    ![Busiest Issues]({% asset guides/manage-event-stream/10.png @path %})

- Alternatively, you can sort the `Issues` table by issue `Frequency`

    ![Issue Frequency]({% asset guides/manage-event-stream/13.png @path %})
