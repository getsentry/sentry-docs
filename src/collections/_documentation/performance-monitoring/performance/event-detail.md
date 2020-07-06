---
title: 'Event Detail'
sidebar_order: 5
---

From [Performance](/performance-monitoring/performance/index) and [Discover](/performance-monitoring/discover-queries/index), you can drill all the way down into a span for a single transaction and traverse multiple directions. This will accelerate your ability to debug slow HTTP requests, database queries, identify associated errors, and root out other bottlenecks.

[{% asset performance/perf-event-detail.png alt="Discover span showing the map of the transactions (aka minimap) and the black dashed handlebars for adjusting the window selection." %}]({% asset performance/perf-event-detail.png @path %})

Information about this specific event is located in the sidebar, listing out the Event ID, date and time of occurrence, project, and downloadable JSON package. More can be found under Event Tag Details. You'll also get a breakdown of operations, which will correspond to the waterfall span view as a legend.

{% capture __alert_content -%}
Currently, only root transactions are searchable. Any span data that inherits from its root are not. 
{%- endcapture -%}
{%- include components/alert.html
    title="Warning"
    content=__alert_content
    level="warning"
%}

## Span View

The span view is a split view where the left-hand side shows the transaction’s span tree, and the right-hand side represents each span as a colored rectangle. Within the tree view, Sentry identifies spans by their `op` and `description` values. If a span doesn’t have a description, Sentry uses the span’s id as a fallback. The first span listed is always the transaction’s root span, from which all other spans in the transaction descend.

[{% asset performance/span-details.png alt="Span detail view shows the span id, trace id, parent span id, and other data such as tags." %}]({% asset performance/span-details.png @path %})

To find these views, you can either go through the [Transaction Summary](/performance-monitoring/performance/transaction-summary) or [Query Builder](/performance-monitoring/discover-queries/query-builder/). Event IDs will be linked to open the corresponding Event Detail.

**With Transaction Summary**

Select the [Performance Homepage](/performance-monitoring/performance/index), then click the affected transaction to display the trace data.

**With Query Builder**

Scroll down to the "Trace Details" context panel in either the Issue Details or the Discover Event Details page, and click on the "View Summary" button. This will maintain the context of the current Sentry event.

_Note_: Users on the Team or Business plans can also view a list of transaction events by clicking on the "Transactions" pre-built query in [Discover](/performance-monitoring/discover-queries/index) or by performing a search with the `event.type:transaction` condition the Discover Query Builder view.

### Minimap

The minimap (top of the span view) reflects the entirety of the transaction broken into spans. You can either click and drag your cursor across the minimap to zoom in or adjust the window selection by dragging the handlebar (black dashed lines) in from the side. This will affect the range you see in the waterfall view. 

### Waterfall

The waterfall view is a split view where the left reflects the transaction's span tree, and the right reflects each span as a horizontal bar (colors represent the operation). Within the tree, Sentry identifies spans by their `operation` and `description` values. If a span doesn't have a description, Sentry uses the span's ID as a fallback. The first span listed is always the transaction's root span, from which all other spans in the transaction descend. 

### Span Details

Clicking on a span row expands the details of that span. From here, you can see all attached properties, such as tags and other field data. With the Trace ID, you'll be able to view all transactions within that given trace. Click "Search by Trace" to view that Discover list. Learn more about [distributed tracing](/performance-monitoring/distributed-tracing/) in our docs. 

{% capture __alert_content -%}

The trace view may be limited to one project at a time if you're on the [Team plan](https://sentry.io/pricing/). Further, project permissions may affect access to some of these transactions.

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

**Traversing Transactions**

Some spans within a transaction may be the parent of another transaction. Under these circumstances, some Span IDs will have a "View Child" or "View Children" button. These will potentially lead to another transaction or a list of transactions. 

{% capture __alert_content -%}

Traversing between parent and child transactions is only available on the [Business plan](https://sentry.io/pricing/). Further, project permissions may affect access to some of these transactions.

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

### Missing Instrumentation 

Gaps between spans may be marked as "Missing Instrumentation." This means a duration in the transaction that isn't accounted for by any of the transaction's spans. It likely means that you need to manually instrument that part of your process. Go back to the [performance setup](/performance-monitoring/setup) for details. 
