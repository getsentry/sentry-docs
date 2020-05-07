---
title: 'Performance Tab'
sidebar_order: 1
---

[SCREENSHOT of Performance Homepage]

The Performance Homepage offers Apdex and Throughput graphs as well as a list of the most problematic transactions so users can see a high-level report of their overall application health.

## Apdex & Throughput Graphs
The Apdex graph shows the ratio of response times in a user's application. Users can get, on aggregate, a sense of how long a customer has waited. For example, if there is a significant dip in an Apdex score in a given window, a user may want to dig into that time period to investigate a potential performance bottleneck.

The Throughput graph indicates the number of transactions over a given time range. Users can quickly visualize the traffic patterns in their application and see if a spike in throughput might be correlated with a dip in their Apdex score.

## Transaction Table
Underneath the graphs, users can view a list of their transactions with the capability to filter down on which transactions users want to view. In this table, users can sort on the provided columns to understand key characteristics of their transactions like [P95]({%- link _documentation/performance/performance-metrics.md -%}#p95-threshold) duration time, [Average Transaction Duration]({%- link _documentation/performance/performance-metrics.md -%}#average-transaction-duration) time, or [Throughput]({%- link _documentation/performance/performance-metrics.md -%}#throughput).

## My Key Transactions
"My Key Transactions" are transactions that users bookmark and can view in a separate dedicated tab. Users may want to bookmark a Transaction as a "Key Transaction" if they monitor performance on a particular transaction or group of transactions. Users can set a Transaction as a "Key Transaction" on the Transaction Summary page. The "All Transactions" view also displays these transactions.

## Transaction Summary

[ SCREENSHOT of Transaction Summary page ]

Navigate to the Transaction Summary page by clicking on any Transaction on the Performance Homepage. On the Transaction Summary page, users can find graphs, a list of slowest transactions, facet maps, and summary statistics about the transaction.

## Transaction Summary Graphs
Duration Breakdown: By graphing P50, P75, P95, P99, and P100 durations distinctly, users can utilize this display to see their transaction performance over time. Users can toggle the display of each segment by clicking on the legend (including Releases). Also, users can zoom in on specific slices to investigate spikes or possible performance regressions from a release.

Latency Histogram: Users can visualize the frequency of transactions that occur within each response time segment. This histogram view can help users understand the shape of their transaction response times and quickly see outliers. Users can click on specific segments to drill down for more granularity.

Apdex / Throughput Graphs: Users can see the same graphs from the Performance homepage isolated to a specific transaction. Users can also zoom in here to investigate spikes and see potential correlations between Apdex and throughput.

Duration Percentiles: This graph shows the average transaction duration across distinct percentiles. For example, users can see how different the P50 and P99 response time durations are for a given transaction and understand the rate of increase between segments.

## Sidebar
The sidebar contains a Tag Summary and more statistics about the transaction. This information updates dynamically if a user changes any of the selections in the global header or when a user drills in on a latency segment (applicable when viewing the Latency Histogram).

## Slowest Transactions
On initial load, the table displays the slowest occurrences of the transaction along with the Event ID, User, Transaction Duration, and Timestamp of the event. Users can click on the [Event ID]({%- link _documentation/performance/distributed-tracing.md -%}#viewing-transactions) to open the span view for the transaction. The table updates dynamically if a user changes any of the selections in the global header or when a user drills in on a latency segment -- applicable when viewing the Latency Histogram.

## Open in Discover
When viewing transactions, users may want to create more curated views. To do this, they can click on the "Open in Discover" button to create a custom query and investigate further. Read more about our [Discover Query Builder]({%- link _documentation/performance/discover/query-builder.md -%}).

## Setting a Key Transaction
Users can set personal "Key Transactions" from the Transaction Summary page. After setting a "Key Transaction," they will be able to view the transactions in a dedicated tab on the Performance Homepage. These "Key Transactions" are not currently shared and limited to ten per user.