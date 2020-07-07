---
title: Uncover Trends with Discover
sidebar_order: 5
---

Discover is a powerful query engine that allows you to query all your error metadata across projects and applications. As you've probably noticed the Sentry SDKs installed in your applications capture huge amounts of events as reflected in the event stream in your Sentry account. Each event is enriched with contextual data about the underlying error, platform, device, user, and more. Also, we highly encourage enriching your error data through the SDK by adding custom tags and configuring the release and environment. For more information see [Put your Data to Work](/guides/enrich-data/).

Let's go over some examples of how to work with all this data to gain some useful insights into the health and stability of your applications.

## Discover Through Issues

The Sentry workflow (Alert - Triage - Resolve) notifies you in real-time when your application breaks, then provides all the information and tools to triage and resolve the error. With Discover, users can take a more proactive approach to find the major issues that break their apps. The flow looks something like this:

1. Open _Discover_ and click on _Build a new query_.

2. From the top-level filter select the projects, environments, and time range of errors you'd like to query.

3. Sentry monitors different types of events for errors, performance, etc. To query issues filter by `event.type:error` in the search bar.

    ![Filter by Error type]({% asset guides/discover/004.png @path %})

4. Edit the results table columns to show the number of events [`count()`], unique issues [`count_unique(issue)`], and impacted users [`count_unique(user)`] per project.

    ![Issues per project]({% asset guides/discover/001.png @path %})

5. At this point, you might want to look for the project with the most issues. Click on the `COUNT_UNIQUE(ISSUE)` column header to order the line items accordingly.

6. Click on the top project line item and select _Add to filter_ to continue looking into the issues of that specific project.

    ![Project with most issues]({% asset guides/discover/002.png @path %})

7. Now let's see what those issues are. Change the table columns to display:
    * `issue` (the issue id)
    * `title` (issue title)
    * `count()` (number of events)
    * `count_unique(user)` (number of unique users impacted by the issue)

8. Per line item/issue you can click on the issue name to open the issue details page and triage it. You can also click on _Open Stack_ to continue querying through the events stack in the context of a specific issue.

    ![Actions per line item]({% asset guides/discover/003.png @path %})

## Discover Through Errors

The true power of Discover lies in its ability to query through all your error metadata, so you're no longer restricted to the context of _Issues_ or _Projects_ and can reveal trends and insights across all your applications. Let's look at some examples.

### Errors by URLs

Create a report looking into all the errors occurring in the URL endpoints across your applications.

* Search condition: `event.type:error has:url`
* Table columns: `url`, `platform.name`, `count()`

![Errors by URL]({% asset guides/discover/005.png @path %})

* Look into any one of the URL endpoints by clicking on _Add to filter_ and changing the table columns.
* Alternatively, filter URLs patterns using wild cards:

![Wildcard filter]({% asset guides/discover/009.png @path %})

### Unhandled Errors

Whether your code is running on a mobile, browser, or server, an unhandled fatal error might crash your application. To find out where those crashes are happening, run the following query in Discover:

* Search condition: `event.type:error handled:no level:fatal`
* Table columns: `mechanism`, `platform.name`, `count()`

    ![Crashes]({% asset guides/discover/006.png @path %})

To look deeper into one of the crash types:

* Select one of the line item values and add them to the filter
* Modify the table columns to show the crash `message` and `count()`

    ![Native Crashes]({% asset guides/discover/007.png @path %})

### Files with Most Errors

To find out which files in your codebase are generating the most errors, run the following query in Discover:

* Search condition: `event.type:error has:stack.filename`
* Table columns: `stack.filename`, `count()`

![By File Names]({% asset guides/discover/010.png @path %})

You can continue exploring a specific filename by adding it to the filer and change the table columns to display the major error culprits in that file:

![Culprits]({% asset guides/discover/008.png @path %})

### Errors Per Release

To find out how the health of a specific project is improving (or not) over time as you release new versions, run the following in Discover:

* Search condition: `event.type:error`
* Table columns: `release`, `count(), count_unique(issue)`

![Issues per release]({% asset guides/discover/012.png @path %})

Each table cell offers a dynamic context menu that allows you to easily continue exploring your data by automatically updating the search bar or the table columns, according to your selection. Actions like, adding or excluding values from the filter, opening a selected release, or viewing the underlying stack of issues:

![Context menu]({% asset guides/discover/013.png @path %})

## Additional Use Cases

As you've probably noticed by now, Discover is extremely useful in gaining visibility and insights into your errors. For additional use cases take a look at the following:

* [What issues are consuming my quota?](/accounts/quotas/manage-event-stream-guide/#-what-issues-are-consuming-my-quota)
* [Spike Protection was activated — what should I do?](/accounts/quotas/manage-event-stream-guide/#-spike-protection-was-activated--what-should-i-do)
* [Discover and Enriching your Error Data](/guides/enrich-data/#discover)
