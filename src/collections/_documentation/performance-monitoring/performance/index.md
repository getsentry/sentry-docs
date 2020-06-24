---
title: 'Performance'
sidebar_order: 2
---

The Performance Homepage is the main view you can go to search or browse for transaction data. Filter by search conditions or choose from a list of sortable transactions in the table. As soon as a transaction of interest has been rooted out, you can investigate further by clicking into it for the [summary view]({% link _documentation/performance-monitoring/performance/transaction-summary.md %}).

[{% asset performance/perf-homepage.png alt="Example of Performance in Product UI" %}]({% asset performance/perf-homepage.png @path %})

## Filter by Search Conditions

The search bar operates similar to the one in the Discover [Query Builder]({% link _documentation/performance-monitoring/discover-queries/query-builder.md %}#filter-by-search-conditions). For example, you can refine your transaction search to a specific release by using `release:` as a key field and the version as a value.

## Graphs

Compare graphs side by side to find any correlations. For example, if an Apdex score dips significantly during a given time period, you'll be able to visualize whether if throughput spiked in the same time interval. The global header and search conditions will also enable you to filter these graphs down even further. Options for displays are listed below.

- [Apdex]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#apdex)
- [Transactions Per Minute (TPM)]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#throughput-total-tpm-tps)
- [Failure Rate]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#failure-rate)
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
- [Failure Rate]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#failure-rate)
- [Apdex]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#apdex)
- Unique Users
- [User Misery]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#user-misery)

## Key Transactions

Have transactions you return time and time again? Bookmark them in the [summary view]({% link _documentation/performance-monitoring/performance/transaction-summary.md %})


 are transactions that you bookmark and can view in a separate dedicated tab. You may want to bookmark a Transaction as a "Key Transaction" if you monitor performance on a particular transaction or group of transactions. You can set a Transaction as a "Key Transaction" on the Transaction Summary page. The "All Transactions" view also displays these transactions.
