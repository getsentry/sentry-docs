---
title: 'Event Detail'
sidebar_order: 5
---

From [Performance](/performance-monitoring/performance/index) and [Discover](/performance-monitoring/discover-queries/index), you can drill all the way down into an event span detail. This will acclerate your ability to debug slow HTTP requests, database queries and other bottlenecks.

[{% asset performance/perf-event-detail.png alt="Discover span showing the map of the transactions (aka minimap) and the black dashed handlebars for adjusting the window selection." %}]({% asset performance/perf-event-detail.png @path %})

Information about this specific event is located in the sidebar, listing out the specific Event ID, date and time of occurence, project and downloadable JSON package. More can be found under Event Tag Details. You'll also get a breakdown of operations, of which will correspond to the waterfall span view as a legend.

{% capture __alert_content -%}
Currently, only root transactions are searchable. Any span data that inherits from it's root are not. 
{%- endcapture -%}
{%- include components/alert.html
    title="Warning"
    content=__alert_content
    level="warning"
%}

## Span View

### Search

Looking for a specific span in this transaction? Use the search bar to find an `operation` or `description`. 

### Minimap

The minimap reflects the entirety of the transaction broken into spans. You can either click and drag your cursor across the minimap to zoom in or adjust the window selection by dragging the handlebar in from the side. This will affect the range you see in the waterfall view. 

### Waterfall

The waterfall view is a split view where the left reflects the transaction's span tree, and the right reflects each span as a horizontal bar (colors represent the operation). Within the tree, Sentry identifies spans by their `operation` and `description` values. If a span doesn't have a description, Sentry uses the span's ID as a fallback. The first span listed is always the transaction's root span, from which all other spans in the transaction descend. 

**Missing Instrumentation** 

Gaps between spans may be marked as "Missing Instrumentation". This means that there is a duration in the transaction that isn't accounted for by any of the transaction's spans, and likely means that you need to manually instrument that part of your process. Go back to the [performance setup](/performance-monitoring/setup) for details. 

**Span Details**

Clicking on a span row expands the details of that span. From here, you can see all attached properties, such as tags and other field data. This includes the ability to search all transactions within a given trace by clicking on "Search by Trace". To learn more about distributed tracing, [read the docs](/performance-monitoring/distributed-tracing/). 

[{% asset performance/span-details.png alt="Span detail view shows the span id, trace id, parent span id, and other data such as tags." %}]({% asset performance/span-details.png @path %})

{% capture __alert_content -%}
On the [Team plan](https://sentry.io/pricing/), results will only be shown for one project at a time. Further, each transaction belongs to a specific project, and you will only be able to see transactions belonging to projects you have permission to view. Therefore, you may not see all transactions in a given trace in your results list.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

**Traversing Transactions**

Some spans within a transaction may be the parent of another transaction. Under these circumstances, expanding the span details may reveal a 
"View Child" or "View Children" button with the Span ID. These will potentially lead to another transaction or a list of transactions. 

{% capture __alert_content -%}
Traversing between transactions in this way is only available on the [Business plan](https://sentry.io/pricing/). Further, each transaction belongs to a specific project, and you will only be able to see the "View Child" or "View Children" button if the child transaction belongs to a project you have permission to view.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}