---
title: 'Event Detail'
sidebar_order: 5
---

**Transaction Details** lets you examine an individual transaction event in detail. Here spans are visualized to help you identify slow HTTP requests, slow database queries, and other bottlenecks. You can also jump to other transactions within the trace, and identify associated errors. Learn more about [Distributed Tracing]({% link _documentation/performance-monitoring/distributed-tracing.md %}) and the [Transaction Details page]({% link _documentation/performance-monitoring/distributed-tracing.md %}#transaction-detail-viewpage).

## Viewing Trace Data

You can see a list of transaction events by clicking on the "Transactions" pre-built query in [Discover]({%- link _documentation/performance-monitoring/discover-queries/index.md -%}), or by using a search condition `event.type:transaction` in the [Discover Query Builder]({%- link _documentation/performance-monitoring/discover-queries/query-builder.md -%}) view.

### Transaction List View

The results of either of the above queries are presented in a list view, where each entry represents a group of one or more transactions. Data about each group is displayed in table form, and comes in two flavors: value-based (such as transaction name), and aggregate (such as average duration). The choice of which kinds of data to display is configurable, and can be changed by clicking 'Edit Columns' at the top right of the table. Bear in mind that adding or removing any value-based columns may affect the way the results are grouped.

This view also includes a timeseries graph, aggregating all results of the query, as well as a summary of the most common tags associated with those results (either via your Sentry instance's [global context]({%- link _documentation/enriching-error-data/additional-data.md -%}) or via each transaction's root span). From this view, you can also filter the transactions list, either by restricting the time window or by adding attributes to the query (or both!).

_Note:_ Currently, only transaction data - the transaction name and any attributes the transaction inherits from its root span - is searchable. Data contained in spans other than the root span is not indexed and therefore cannot be searched.

For more details about the transaction list view, see the full documentation on [Discover's Query Builder]({%- link _documentation/performance-monitoring/discover-queries/query-builder.md -%}), and for more about transaction metrics, see [Metrics]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#transaction-metrics).

### Transaction Detail View

When you open a transaction event in Discover (by clicking on the icon at the left side of the row), you'll see the **span view** at the top of the page. Other information the SDK captured as part of the transaction event (such as the transaction's tags and automatically collected breadcrumbs) is displayed underneath and to the right of the span view.

[{% asset performance/perf-event-detail.png alt="Discover span showing the map of the transactions (aka minimap) and the black dashed handlebars for adjusting the window selection." %}]({% asset performance/perf-event-detail.png @path %})

#### Using the Span View

The span view is a split view where the left-hand side shows the transaction's span tree, and the right-hand side represents each span as a colored rectangle. Within the tree view, Sentry identifies spans by their `op` and `description` values. If a span doesn't have a description, Sentry uses the span's id as a fallback. The first span listed is always the transaction's root span, from which all other spans in the transaction descend.

At the top of the span view is a minimap, which shows which specific portion of the transaction you're viewing.

_Zooming In on a Transaction_

As shown in the Discover span screenshot above, you can click and drag your mouse cursor across the minimap (top of the span view). You can also adjust the window selection by dragging the handlebars (black dashed lines). 

_Missing Instrumentation_

Sentry may indicate that gaps between spans are "Missing Instrumentation." This means that there is time in the transaction that isn't accounted for by any of the transaction's spans, and likely means that you need to manually instrument that part of your process.

_Viewing Span Details_

Clicking on a row in the span view expands the details of that span. From here, you can see all attached properties, such as tags and data.

[{% asset performance/span-details.png alt="Span detail view shows the span id, trace id, parent span id, and other data such as tags." %}]({% asset performance/span-details.png @path %})

_Searching by Trace ID_

You can search for all of the transactions in a given trace by expanding any of the span details and clicking on "Search by Trace".

_Note:_ On the [Team plan](https://sentry.io/pricing/), results will only be shown for one project at a time. Further, each transaction belongs to a specific project, and you will only be able to see transactions belonging to projects you have permission to view. Therefore, you may not see all transactions in a given trace in your results list.

_Traversing to Child Transactions_

Some spans within a transaction may be the parent of another transaction. When you expand the span details for such spans, you'll see the "View Child" button, which, when clicked, will lead to the child transaction's details view.

_Note:_ Traversing between transactions in this way is only available on the [Business plan](https://sentry.io/pricing/). Further, each transaction belongs to a specific project, and you will only be able to see the "View Child" button if the child transaction belongs to a project you have permission to view.
