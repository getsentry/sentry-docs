---
title: 'Transaction Summary'
sidebar_order: 4
---

Navigate to the Transaction Summary page by clicking on any transaction on the Performance Homepage. On the Transaction Summary page, you'll find graphs, a list of slowest transactions, facet maps, and summary statistics about the transaction.

[{% asset performance/perf-summary.png alt="Example of Performance in Product UI" %}]({% asset performance/perf-summary.png @path %})

## Graphs
Duration Breakdown 
: By graphing P50, [P75]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#p75-threshold), [P95]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#p95-threshold), [P99]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#p99-threshold), and P100 durations distinctly, you can utilize this display to see their transaction performance over time. Toggle the display of each segment by clicking on the legend (including Releases). Also, zoom in on specific slices to investigate spikes or possible performance regressions from a release.

Latency Histogram
: Visualize the frequency of transactions that occur within each response time segment. This histogram view can help you understand the shape of transaction response times and quickly see outliers. Click on specific segments to drill down for more granularity.

Apdex / Throughput Graphs
: See the same graphs from the Performance homepage isolated to a specific transaction. Zoom in to investigate spikes and see potential correlations between Apdex and Throughput.

Duration Percentiles
: This graph shows the [average transaction duration]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#average-transaction-duration) across distinct percentiles. For example, see how different the P50 and P99 response time durations are for a given transaction and understand the rate of increase between segments.

## Sidebar
The sidebar contains a Tag Summary, [Apdex/Throughput](#apdex--throughput-graphs) graphs, error rate graphs, and more statistics about the transaction. This information updates dynamically if you change any of the selections in the global header or when you drill in on a latency segment (applicable when viewing the Latency Histogram).

## Slowest Transactions
On initial load, the table displays the slowest occurrences of the transaction along with the Event ID, User, Transaction Duration, and Timestamp of the event. Click on the Event ID to open the [span view]({%- link _documentation/performance-monitoring/distributed-tracing.md -%}#viewing-transactions) for the transaction. The table updates dynamically if you change any of the selections in the global header or when you drill in on a latency segment -- applicable when viewing the Latency Histogram.

### Open in Discover
When viewing transactions, you may want to create more curated views. To do this, click on the "Open in Discover" button to create a custom query and investigate further. For more details, see the full documentation on [Discover Query Builder]({%- link _documentation/performance-monitoring/discover-queries/query-builder.md -%}).

## Key Transaction
Set personal "Key Transactions" from the Transaction Summary page. After setting a "Key Transaction," you can view the transactions in a dedicated tab on the Performance Homepage. These "Key Transactions" are not currently shared and limited to ten per user.