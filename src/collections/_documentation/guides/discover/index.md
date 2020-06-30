---
title: Discover your Errors
sidebar_order: 5
---

## Before We Start

When creating a new Discover query you always start off with your raw event stream filtered by your Projects, Environments, and a time range - as you define in the top level filter. The search bar is similar to an SQL WHERE clause and provides advanced filtering based on your event tags and error data.

The event time graph will display the result set of events over time and the total number of events.

## Discover Issues

The Sentry workflow (Alert - Triage - Resolve) notifies you in real time when your application breaks, and then provides all the information and tools to triage and resolve the error. With Discover, users can take a more proactive approach to find those major issues that break down their apps. The flow would look something like this:

1. Open _Discover_ and click on _Build a new query_

2. From the top level filter select the projects, environments, and time span of errors you'd like to query

3. Sentry monitors different types of events for errors, performance, and more. To query issues filter by `event.type:error` in the search bar.

    ![Filter by Error type]({% asset guides/discover/004.png @path %})

4. Edit the results table columns to show number of event, unique issues, and impacted users per project

    ![Issues per project]({% asset guides/discover/001.png @path %})

5. At this point, you might want to look for the project with the most issues. Click on the `COUNT_UNIQUE(ISSUE)` column header to order the line items accordingly.

6. Click on the top project line item and select _Add to filter_ to continue looking into the issues of that specific project.

    ![Project with most issues]({% asset guides/discover/002.png @path %})

7. Now let's see what those issues are. Change the table columns to show `issue` [id], `title` [of the issue], `count()` [number of events], and `count_unique(user)` [number of users impacted by the issue].

8. Per line item/issue you can click on the issue name to open the issue details page and triage it. You can also click on _Open Stack_ to continue querying through the events stack in the context of a specific issue.

    ![Actions per line item]({% asset guides/discover/003.png @path %})

## Discover Errors

The true power of Discover lies in it's ability to query through the metadata of all your events, so you're no longer restricted to the context of _Issues_ or _Projects_ and can reveal trends and insights across all your applications.

### Errors by URLs

Create a report looking into all the errors occurring in your applications URL endpoints.

- Search condition: `event.type:error has:url`
- Table columns: `url`, `platform.name`, `count()`

![Errors by URL]({% asset guides/discover/005.png @path %})

Dive deeper into any one of those URL endpoints by clicking on Add to filter and changing the table columns.

### Unhandled Error

Whether your code is running on a mobile, browser, or server, an unhandled fatal error might crash your application. To find out where those crashes are happening, run the following query in Discover:

- Search condition: `event.type:error handled:no level:fatal`
- Table columns: `mechanism`, `platform.name`, `count()`

    ![Crashes]({% asset guides/discover/006.png @path %})

To look deeper into one of the crash types

- Select one of the line item values and add them to the filter
- Modify the table columns to show the crash `message` and `count()`

    ![Native Crashes]({% asset guides/discover/007.png @path %})


### Files with Most Errors

- Search condition: `event.type:error has:`
- Table columns: `url`, `platform.name`, `count()`

### Errors per release over time OR latest release




