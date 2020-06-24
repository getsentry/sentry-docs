---
title: 'Performance'
sidebar_order: 2
---

The Performance Homepage is the main view you can go to search or browse for transaction data. Filter by search conditions or choose from a list of sortable transactions in the table. As soon as a transaction of interest has been rooted out, you can investigate further by clicking into it for the [summary view](/performance-monitoring/performance/transaction-summary/).

[{% asset performance/perf-homepage.png alt="Example of Performance in Product UI" %}]({% asset performance/perf-homepage.png @path %})

## Filter by Search Conditions

The search bar operates similar to the one in the Discover [Query Builder](/performance-monitoring/discover-queries/query-builder/#filter-by-search-conditions). For example, you can refine your transaction search to a specific release by using `release:` as a key field and the version as a value.

## Graphs

Compare graphs side by side to find any relevant correlations. For example, if an Apdex score dips significantly during a given time period, you'll be able to visualize whether if throughput spiked in the same time interval. The global header and search conditions will also enable you to filter these graphs down even further. Display options are listed below.

- [Apdex](/performance-monitoring/performance/metrics/#apdex)
- [Transactions Per Minute (TPM)](/performance-monitoring/performance/metrics/#throughput-total-tpm-tps)
- [Failure Rate](/performance-monitoring/performance/metrics/#failure-rate)
- [p50 Duration](/performance-monitoring/performance/metrics/#p50-threshold)
- [p95 Duration](/performance-monitoring/performance/metrics/#p95-threshold)
- [p99 Duration](/performance-monitoring/performance/metrics/#p99-threshold)

## Transaction Table

Below the graphs are a list of the transactions that follow the global header and search conditions. The provided columns help illuminate the status of these transactions.

- Transaction Name
- Project 
- [TPM](/performance-monitoring/performance/metrics/#throughput-total-rpm-rps)
- [P50](/performance-monitoring/performance/metrics/#average-transaction-duration)
- [P95](/performance-monitoring/performance/metrics/#p95-threshold)
- [Failure Rate](/performance-monitoring/performance/metrics/#failure-rate)
- [Apdex](/performance-monitoring/performance/metrics/#apdex)
- Unique Users
- [User Misery](/performance-monitoring/performance/metrics/#user-misery)

## Key Transactions

If you have transactions you return time and time again, you can mark each one off as a key transaction in their corresponding [summary views](/performance-monitoring/performance/transaction-summary/). This will enable you to have a shortcut to view Key Transactions only by toggling the tab in the upper right corner of the homepage. 
