---
title: 'Discover V2'
sidebar_order: 4
---

{% capture __alert_content -%}
This version of Discover is in beta. Discover V1 will deprecate at the end of February 2020.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Our Discover tool combines the best parts of our Events and existing Discover features, providing visibility into your data across environments and building upon and enriching your error data. This new feature will allow you to query and unlock deeper insights into the health of your entire system and answer critical business questions --- all in one place.

[{% asset discover/discover-homepage.png alt="Full view of Discover homepage with minigraphs and button to build new queries." %}]({% asset discover/discover-homepage.png @path %})

## Discover Homepage

The Discover homepage offers views of all your saved queries and Sentry's pre-built queries so you can quickly dive into areas that need immediate attention.

### Minigraphs

Minigraphs are the individual cards on the homepage that display a summarized view of the data in a specific query. Users can get a high-level view of the information in each minigraph to see what they want to investigate first. For example, if a spike occurred in the past 24 hours, a user may view that query first.

### Pre-built Queries

- Errors - Users can see their most frequent errors by total errors and unique errors. From the pre-built Error Query, users can also add additional columns and change the groupings to achieve their desired breakdown.
- Project Summary - Users can see their most active projects, by total Issues and unique Issues, to see which projects need the most attention or further investigation.
- Errors by URL - Users can see their most common errors broken down by specific URL
- Errors by Release - users can query their errors by release to see if a change introduced in a particular release caused a spike in errors or to see if it fixed an issue.

### Saved Queries

Saved queries have a yellow star icon and sort from most recently updated to least recently updated.

**Deleting or Duplicating Saved Queries**

Delete or duplicate a saved query in the Context Menu — looks like ellipses — located in the lower right corner of a minigraph.

**Searching Saved Queries**

Saved queries will be viewable by anyone in your Sentry organization. You can use our search bar on the landing page to find a specific query. 


## Query Builder

Navigate to any query page from the Discover Homepage in these ways:

- Clicking on "Build a new query"
- Clicking on any Pre-built or Saved Queries

On the Query results page, you'll find the graph, table, and facet maps. The Query Builder enables the user to create custom views of the events sent to Sentry.io. You can add any tags/fields as columns, aggregate with columns, and sort with columns.

### Sharing Query Views

Share your queries as often as you want. You can share URLs to other users who also have access to the same organization. As each part of the query is built, the results update, and the URL is updated so that in-progress searches can be shared in email/chat.

### Saved Query

Although search queries are shareable, you can save them as Saved Queries. Saved Queries are visible to the entire organization. In other words, Saved Queries **are not** scoped to the user's account. Saved Queries have a yellow star icon on the Discover landing page. You can use either a pre-built query or another saved query to create a new Saved Query.

For more details, see [full documentation on the Query Builder]({%- link _documentation/workflow/discover2/query-builder.md -%}).


## Event Details

![DON%20T%20Add%20content%20to%20this%20Draft%20Discover%20V2/Untitled%201.png](DON%20T%20Add%20content%20to%20this%20Draft%20Discover%20V2/Untitled%201.png)

Navigate to the Event Details page from **Discover > Query > Event Detail**. On the event details view, you can find all of the details about a single event. 

On the left, you will see a series of tabs. These tabs contain details about the various contexts, and event dimensions Sentry has captured. 

On the right, you will see the current event's identifier, timestamp, and link to view the normalized JSON payload that Sentry received. You can also see the event's linked issue and tag details.

The right sidebar can be hidden with the "Hide Details" button found in the Event Details Header.

### Tags

The tag value links displayed on the Event Details can be used to refine your search results further. Clicking on any tag link will take you to a new Discover query with the clicked tag value added as a condition. If you were looking at an aggregated result, the new query will have all aggregations removed. This allows you to drill into aggregated results and explore your data more quickly.

### Details Graph

If your query included aggregations, the event details view will contain a graph at the top of the page. This graph visualizes the volume of events within the aggregation over time. The pin marker and vertical bar indicate the position of the currently displayed event within the aggregation. Hovering over the graph line will display a tooltip with more precise time and event volume details.

### Traversing aggregated events

When viewing results that include aggregations, you can use the "Older" and "Newer" navigation buttons on the top right to view other events from the current aggregation. You can also click on the line displayed in the Details Graph to navigate to an event within that time slice.

### Related Issues

On events that have an issue, a related issue panel will be shown in the sidebar. This panel gives you a quick glance at the event volume for that issue and lets you navigate to the related issue quickly.
