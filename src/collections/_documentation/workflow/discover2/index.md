---
title: 'Discover v2'
sidebar_order: 4
---

{% capture __alert_content -%}
The following is documentation for our new query builder Discover v2. [Discover v1]({%- link _documentation/workflow/discover.md -%}) will deprecate at the end of February 2020.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Our Discover tool combines the best parts of our Events and existing Discover features, providing visibility into your data across environments and building upon and enriching your error data. This new feature will allow you to query and unlock deeper insights into the health of your entire system and answer critical business questions --- all in one place.

[{% asset discover/discover-homepage.png alt="Full view of the Discover Homepage with query cards and button to build new queries." %}]({% asset discover/discover-homepage.png @path %})

## Discover Homepage

The Discover Homepage offers views of all your saved queries and Sentry's pre-built queries so you can quickly dive into areas that need immediate attention.

### Query Cards

Query cards are the individual cards on the Homepage that display a summarized view of the data in a specific query. Users can get a high-level view of the information in each query card to see what they want to investigate first. For example, if a spike occurred in the past 24 hours, a user may view that query first.

### Pre-built Queries

- All Events: Users can see the raw error stream for any group of projects. This replaces the Events feature and gives users the ability to add additional columns and change groupings to achieve their desired breakdown.
- Errors by Title: Users can see their most frequently occurring errors by the total number of raw errors, as well as the total number of users affected.
- Errors by URL: Users can see the pages that generated the most errors and different types of issues. As a reminder, issues are a group of fingerprinted Events. For more details, see the [full documentation on fingerprinting]({%- link _documentation/data-management/event-grouping/index.md -%}).

### Saved Queries

Saved queries have a yellow star icon and sort from most recently updated to least recently updated.

**Deleting or Duplicating Saved Queries**

Delete or duplicate a saved query in the Context Menu --- looks like ellipses --- located in the lower right corner of each query card.

**Searching Saved Queries**

Saved queries will be viewable by anyone in your Sentry organization. You can use our search bar on the homepage to find a specific query. 


## Query Builder

[{% asset discover/discover-results.png alt="Page displaying a graph of error spikes by URL, the event tag summary, and results of the query." %}]({% asset discover/discover-results.png @path %})

Navigate to any query page from the Discover Homepage in these ways:

- Click on "Build a new query"
- Click on any pre-built or saved queries

On the query's results page, you'll find the graph, table, and facet maps. The Query Builder enables the user to create custom views of the events sent to Sentry.io. You can add any tags/fields as columns, aggregate with columns, and sort with columns.

### Sharing Query Views

Share your queries as often as you want. You can share URLs with other users who also have access to the same organization. As each part of the query is built, the results update, and the URL is updated so that in-progress searches can be shared in email/chat.

### Saved Query

Although search queries are shareable, you can save them as Saved Queries. Saved Queries are visible to the entire organization. In other words, Saved Queries **are not** scoped to the user's account. You can find Saved Queries on the Discover Homepage with the yellow star icon. You can use either a pre-built query or an existing saved query to create a new Saved Query.

For more details, see [full documentation on the Query Builder]({%- link _documentation/workflow/discover2/query-builder.md -%}).


## Event Details

[{% asset discover/discover-event-details.png alt="Event detail page displaying a graph with spikes, the event details, and different metrics for tags." %}]({% asset discover/discover-event-details.png @path %})

Navigate to the Event Details page from **Discover > Query > Event Detail**. On the Event Details view, you can find all of the details about a single event. 

On the left, you will see a series of tabs. These tabs contain details about the various contexts, and event dimensions Sentry has captured. 

On the right, you will see the current event's identifier, timestamp, and link to view the normalized JSON payload that Sentry received. You can also see the event's linked issue and tag details.

The right sidebar can be hidden with the "Hide Details" button found in the Event Details header.

### Tags

The tag value links displayed on the Event Details can be used to refine your search results further. Clicking on any tag link will take you to a new Discover query with the clicked tag value added as a condition. If you were looking at an aggregated result, the new query will have all aggregations removed. This allows you to drill into aggregated results and explore your data more quickly.

### Details Graph

If your query included aggregations, the Event Details view will contain a graph at the top of the page. This graph visualizes the volume of events within the aggregation over time. The pin marker and vertical bar indicate the position of the currently displayed event within the aggregation. Hovering over the graph line will display a tooltip with more precise time and event volume details.

### Traversing Aggregated Events

When viewing results that include aggregations, you can use the "Older" and "Newer" navigation buttons on the top right to view other events from the current aggregation. You can also click on the line displayed in the Details Graph to navigate to an event within that time slice.

### Related Issues

On events that have an issue, a related issue panel will be shown in the sidebar. This panel gives you a quick glance at the event volume for that issue and lets you quickly navigate to the related issue.
