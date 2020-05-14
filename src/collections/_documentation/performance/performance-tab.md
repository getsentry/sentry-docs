---
title: 'Performance Tab'
sidebar_order: 1
---

The Performance Homepage offers [Apdex]({%- link _documentation/performance/performance-metrics.md -%}#apdex) and [Throughput]({%- link _documentation/performance/performance-metrics.md -%}#throughput-total-rpm-rps) graphs as well as a list of the most problematic transactions to display a high-level report of their overall application health.

## Apdex & Throughput Graphs
The [Apdex]({%- link _documentation/performance/performance-metrics.md -%}#apdex) graph displays the ratio of response times in an application measured against a threshold. This information is displayed as an aggregate to provide a sense of how long a customer has waited. For example, if the Apdex score dips significantly during a given time period, you may want to investigate that time period for a potential performance bottleneck.

The Throughput graph indicates the number of transactions over a given time range. You can quickly visualize the traffic patterns in your application and see if a spike in throughput might be correlated with a dip in your Apdex score.

## Transaction Table
Underneath the graphs, view a list of your transactions with the capability to filter down on which transactions you want to view. In this table, sort on the provided columns to understand key characteristics of your transactions like [P95]({%- link _documentation/performance/performance-metrics.md -%}#p95-threshold) duration time, [Average Transaction Duration]({%- link _documentation/performance/performance-metrics.md -%}#average-transaction-duration) time, or [Throughput]({%- link _documentation/performance/performance-metrics.md -%}#throughput-total-rpm-rps).

## My Key Transactions
"My Key Transactions" are transactions that you bookmark and can view in a separate dedicated tab. You may want to bookmark a Transaction as a "Key Transaction" if you monitor performance on a particular transaction or group of transactions. You can set a Transaction as a "Key Transaction" on the Transaction Summary page. The "All Transactions" view also displays these transactions.

## Transaction Summary

Navigate to the Transaction Summary page by clicking on any transaction on the Performance Homepage. On the Transaction Summary page, you'll find graphs, a list of slowest transactions, facet maps, and summary statistics about the transaction.

## Transaction Summary Graphs
Duration Breakdown 
: By graphing P50, [P75]({%- link _documentation/performance/performance-metrics.md -%}#p75-threshold), [P95]({%- link _documentation/performance/performance-metrics.md -%}#p95-threshold), [P99]({%- link _documentation/performance/performance-metrics.md -%}#p99-threshold), and P100 durations distinctly, you can utilize this display to see their transaction performance over time. Toggle the display of each segment by clicking on the legend (including Releases). Also, zoom in on specific slices to investigate spikes or possible performance regressions from a release.

Latency Histogram
: Visualize the frequency of transactions that occur within each response time segment. This histogram view can help you understand the shape of transaction response times and quickly see outliers. Click on specific segments to drill down for more granularity.

Apdex / Throughput Graphs
: See the same graphs from the Performance homepage isolated to a specific transaction. Zoom in to investigate spikes and see potential correlations between Apdex and Throughput.

Duration Percentiles
: This graph shows the [average transaction duration]({%- link _documentation/performance/performance-metrics.md -%}#average-transaction-duration) across distinct percentiles. For example, see how different the P50 and P99 response time durations are for a given transaction and understand the rate of increase between segments.

## Sidebar
The sidebar contains a Tag Summary, [Apdex/Throughput](#apdex--throughput-graphs) graphs, error rate graphs, and more statistics about the transaction. This information updates dynamically if you change any of the selections in the global header or when you drill in on a latency segment (applicable when viewing the Latency Histogram).

## Slowest Transactions
On initial load, the table displays the slowest occurrences of the transaction along with the Event ID, User, Transaction Duration, and Timestamp of the event. Click on the Event ID to open the [span view]({%- link _documentation/performance/distributed-tracing.md -%}#viewing-transactions) for the transaction. The table updates dynamically if you change any of the selections in the global header or when you drill in on a latency segment -- applicable when viewing the Latency Histogram.

## Open in Discover
When viewing transactions, you may want to create more curated views. To do this, click on the "Open in Discover" button to create a custom query and investigate further. For more details, see the full documentation on [Discover Query Builder]({%- link _documentation/performance/discover/query-builder.md -%}).

## Setting a Key Transaction
Set personal "Key Transactions" from the Transaction Summary page. After setting a "Key Transaction," you can view the transactions in a dedicated tab on the Performance Homepage. These "Key Transactions" are not currently shared and limited to ten per user.