---
title: 'Performance'
sidebar_order: 2
---

The Performance Homepage is the main view where you can search or browse for transaction data. Filter by search conditions or choose from a list of sortable transactions in the table. As soon as a transaction of interest has been rooted out, you can investigate further by clicking it for its [summary view](/performance-monitoring/performance/transaction-summary/).

[{% asset performance/perf-homepage.png alt="Performance Homepage" %}]({% asset performance/perf-homepage.png @path %})

## Filter by Search Conditions

The search bar operates similarly to the one in the Discover [Query Builder](/performance-monitoring/discover-queries/query-builder/#filter-by-search-conditions). For example, you can refine your transaction search to a specific release by using `release:` as a key field and assigning the version as a value.

## Graphs

Compare graphs side by side to find any relevant correlations. For example, if an Apdex score dips significantly during a given time period, you'll be able to visualize whether throughput spiked in the same time interval. The global header and search conditions will also enable you to filter these graphs even more. The display options are listed below:

- [Apdex](/performance-monitoring/performance/metrics/#apdex)
- [Transactions Per Minute (TPM)](/performance-monitoring/performance/metrics/#throughput-total-tpm-tps)
- [Failure Rate](/performance-monitoring/performance/metrics/#failure-rate)
- [p50 Duration](/performance-monitoring/performance/metrics/#p50-threshold)
- [p95 Duration](/performance-monitoring/performance/metrics/#p95-threshold)
- [p99 Duration](/performance-monitoring/performance/metrics/#p99-threshold)

## Transaction Table

Below the graphs are a list of transactions that may be filtered down based on global header and search condition filters. The provided columns offer details about each transaction.

- Transaction Name
- Project
- [TPM](/performance-monitoring/performance/metrics/#throughput-total-rpm-rps)
- [P50](/performance-monitoring/performance/metrics/#average-transaction-duration)
- [P95](/performance-monitoring/performance/metrics/#p95-threshold)
- [Failure Rate](/performance-monitoring/performance/metrics/#failure-rate)
- [Apdex](/performance-monitoring/performance/metrics/#apdex)
- Unique Users
- [User Misery](/performance-monitoring/performance/metrics/#user-misery)

## Key Transaction View

If you have transactions you frequently return to;  you can mark each one as a key transaction in their corresponding [summary views](/performance-monitoring/performance/transaction-summary/#key-transaction). This enables a shortcut to view only Key Transactions by toggling the tab in the upper right corner of the homepage.
