---
title: Visibility
sidebar_order: 4
---

Sentry's new Visibility features help you gain detailed perspectives of your application's health by providing tools to navigate your issues across multiple projects in a single view.

&nbsp;
## Dashboards
{% include components/alert.html
    title="Note"
    content="Available if you're on Business or a Trial, and you're an Early Adopter."
    level="info"
%}

Dashboards is a compilation of various data visualizations of your aggregate errors across your organization --- including graphs of your errors, geographic mapping, and lists of browsers. Dashboards allow you to drill into data by selecting points of interest. Filters are also persistent, so you'll see visual representations of applied filters.

&nbsp;
### Overall View of Application
Each graph and visualization helps uncover crucial patterns and trends about where your customers are hitting errors.
 
[{% asset visibility/dashboard.png alt="Line graphs describing events, events by release, affected users, and handled vs unhandled issues." %}]({% asset visibility/dashboard.png @path %})

&nbsp;
### Dive into Specific Projects
Filter your data with project-specific parameters.

[{% asset visibility/projt-filter.png alt="Drop-down that allows filtering based on projects." %}]({% asset visibility/projt-filter.png @path %})

&nbsp;
### Filter by Environment
Distill needs by choosing explicit environments.

[{% asset visibility/env-filter.png alt="Drop-down that allows filtering based on environment." %}]({% asset visibility/env-filter.png @path %})

&nbsp;
### Refine by Time Period
Define distinct time periods for a more clear-cut glimpse.

[{% asset visibility/date-filter.png alt="Drop-down that allows filtering based on calendar dates." %}]({% asset visibility/date-filter.png @path %})
 
&nbsp;
### Query with Discover
Discover is Sentry's built-in query builder, enabling you to uncover patterns and trends in your events data.

[{% asset visibility/discover-query.png alt="Drop-down that allows filtering based on query key words." %}]({% asset visibility/discover-query.png @path %})

&nbsp;
## Discover
{% include components/alert.html
    title="Note"
    content="Available if you're on Business or a Trial, and you're an Early Adopter."
    level="info"
%}

Discover helps you query raw event data in Sentry, across any number of projects within your organization. For more information on how to use the query builder and event fields, see the [full documentation on Discover]({%- link _documentation/workflow/discover.md -%}).

[{% asset visibility/discover-results.png alt="Query results that summarize data for country codes by unique id." %}]({% asset visibility/discover-results.png @path %})

&nbsp;
## Events
{% include components/alert.html
    title="Note"
    content="Available if you're on Business or a Trial, and you're an Early Adopter. The Team pricing level allows you one project on the feed, and the Business and Enterprise levels allow you to view all your projects at once."
    level="info"
%}

The Events View uncovers your raw error stream for any group of projects, including environment or time range. To investigate a spike, select the spike in your Events View graph to narrow your timeframe. Drill down into any individual event to see issues related to that event.

[{% asset visibility/events-graph.png alt="Line graph illustrating spikes in events for a project. Includes stack trace." %}]({% asset visibility/events-graph.png @path %})

&nbsp;
### Specify with Search
Slice and dice your Issues and Events views with the updated Search.
- Wildcards: use the `*` operator. For example, `user.email:*@example.com`
- Negation: use the `!` operator to exclude terms. For example, `!user.email:user@example.com`
- Advanced properties: search on advanced event properties like `stack` (including `stack.filename`, `stack.module`, etc.), as well as `geo` (including `geo.country_code`, `geo.city`, etc.).

For more information on syntax and searchable properties, see the [full Search documentation]({%- link _documentation/workflow/search.md -%}).

&nbsp;
## Tracing ID
Tracing allows you to link systems together while following the error's path to its root. By using a tracing id, you get visibility into errors on the front-end that have roots in the back-end.

A typcial use-case: When you use a transaction id for cross-project issues, all the information you want to know about those events will be in the Events View and searchable in Discover, including all the users that hit those certain events. 

```javascript
// generate unique transactionId and set as Sentry tag
const transactionId = getUniqueId();
Sentry.configureScope(scope => {
    scope.setTag("transaction_id", transactionId);
});

// perform request (set transctionID as header and throw error appropriately)
request.post({
    url: "http://localhost:3001/checkout",
    json: order,
    headers: {
        "X-Session-ID": this.sessionId,
        "X-Transaction-ID": transactionId
    }
}, (error, response) => {
    if (error) {
        throw error;
    }
    if (response.statusCode === 200) {
        this.setState({ success: true });
    } else {
        throw new Error(response.statusCode + " - " + response.statusMessage);
    }
}
```

For more information, see how you can use [Sentry and NGINX to trace errors to logs](https://blog.sentry.io/2019/01/31/using-nginx-sentry-trace-errors-logs).
