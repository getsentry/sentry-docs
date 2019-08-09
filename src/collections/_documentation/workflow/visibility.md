---
title: Visibility
sidebar_order: 4
---

Sentry's new Visibility features --- Discover, Dashboards, and Events --- help you gain detailed perspectives of your application's health by providing filtering tools to navigate your issues across multiple projects in a single view.

## Discover
{% include components/alert.html
    title="Note"
    content="Available if you're on a Business plan or a Trial."
    level="info"
%}

Discover helps you query event data in Sentry, across any number of projects within your organization. It enables you to uncover patterns and trends in your events' data. For example, you can aggregate event count by `stack.filename` and `stack.function`, and then browse the data as a table, bar chart, or line graph.

For more information on how to use the query builder and event fields, see the [full documentation on Discover]({%- link _documentation/workflow/discover.md -%}).

[{% asset visibility/query-result.png alt="Query results, in the form of a line graph, that summarize data by unique user email." %}]({% asset visibility/query-result.png @path %})

## Dashboards
{% include components/alert.html
    title="Note"
    content="Available if you're on a Business plan or a Trial."
    level="info"
%}

Dashboards are various data visualizations of your errors across your organization --- including graphs of your errors, geographic mapping, and lists of browsers. Dashboards allow you to drill into data by selecting points of interest.

### Overall View of Application
Each graph and visualization helps uncover crucial patterns and trends about where your customers are hitting errors.

[{% asset visibility/dashboard.png alt="Line graphs describing events, events by release, affected users, and handled vs unhandled issues." %}]({% asset visibility/dashboard.png @path %})

### Dive into Specific Projects
Filter your data with project-specific parameters.

[{% asset visibility/projt-filter.png alt="Drop-down that allows filtering based on projects." %}]({% asset visibility/projt-filter.png @path %})

### Filter by Environment
Distill needs by choosing explicit environments.

[{% asset visibility/env-filter.png alt="Drop-down that allows filtering based on environment." %}]({% asset visibility/env-filter.png @path %})

### Refine by Time Period
Define distinct time periods for a more clear-cut glimpse.

[{% asset visibility/date-filter.png alt="Drop-down that allows filtering based on calendar dates." %}]({% asset visibility/date-filter.png @path %})

## Events
{% include components/alert.html
    title="Note"
    content="Available if you're on a Team plan, Business plan, or a Trial. The Team pricing level allows you one project on the feed, and the Business and Enterprise levels allow you to view all your projects at once or any subset."
    level="info"
%}

The Events View uncovers your raw error stream for any group of projects, including environment or time range. To investigate a spike, select the spike in your Events View graph to narrow your timeframe. Drill down into any individual event to see issues related to that event.

[{% asset visibility/events-graph.png alt="Line graph illustrating spikes in events for a project. Includes stack trace." %}]({% asset visibility/events-graph.png @path %})

### Specify with Search
The updated Search helps you get specific with Issues and Events views.
- Wildcards: use the `*` operator as a placeholder for specific characters or strings. For example, `user.email:*@example.com`
- Negation: use the `!` operator to exclude terms. For example, `!user.email:user@example.com`
- Advanced properties: search on advanced event properties like `stack` (including `stack.filename`, `stack.module`, etc.), as well as `geo` (including `geo.country_code`, `geo.city`, etc.).

For more information on syntax and searchable properties, see the [full Search documentation]({%- link _documentation/workflow/search.md -%}).

## Use-Case: Tracing
Modern applications have many components that can produce errors, making it harder to identify the root cause. Tracing allows you to link systems together while following the error's path to its root. By tagging some form of a tracing ID (for example: span ID, request ID, UUID, or transaction ID), you can correlate errors coming from different parts of your application and see them in the Events View.

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
