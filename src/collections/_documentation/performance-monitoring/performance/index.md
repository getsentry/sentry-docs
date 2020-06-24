---
title: 'Performance'
sidebar_order: 2
---

The Performance Homepage is the main view you can go to search or browse for transaction data. [Filter by search conditions]({% link _documentation/performance-monitoring/discover-queries/query-builder.md %}#filter-by-search-conditions) or choose from a list of sortable transactions in the table. As soon as a transaction of interest has been rooted out, you can investigate further by clicking into it for the [summary view]({% link _documentation/performance-monitoring/performance/transaction-summary.md %}).

[{% asset performance/perf-homepage.png alt="Example of Performance in Product UI" %}]({% asset performance/perf-homepage.png @path %})

## Search Conditions

The search bar operates similar to the one in the Discover [Query Builder]({% link _documentation/performance-monitoring/discover-queries/query-builder.md %}#filter-by-search-conditions). For example, refine your search to a specific release by using Release as a key field and the version as a value.

## Graphs

Compare graphs side by side to see any correlations. For example, if an Apdex score dips significantly during a given time period, you'll be able to visualize whether if throughput spiked in the same interval. The global header and search conditions will enable you to filter this graph down even further. 

- [Apdex]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#apdex)
- Transactions Per Minute (TPM)
- Failure Rate
- p50 Duration
- p95 Duration
- p99 Duration

## Transaction Table

Below the graphs are a list of the transactions that follow the global header and search conditions. The provided columns help illuminate the status of these transactions.

- Transaction Name
- Project 
- [TPM]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#throughput-total-rpm-rps)
- [P50]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#average-transaction-duration)
- [P95]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#p95-threshold)
- Failure Rate
- Apdex
- Unique Users
- User Misery

## My Key Transactions
"My Key Transactions" are transactions that you bookmark and can view in a separate dedicated tab. You may want to bookmark a Transaction as a "Key Transaction" if you monitor performance on a particular transaction or group of transactions. You can set a Transaction as a "Key Transaction" on the Transaction Summary page. The "All Transactions" view also displays these transactions.
