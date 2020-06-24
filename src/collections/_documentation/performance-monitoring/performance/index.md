---
title: 'Performance'
sidebar_order: 2
---
{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [performance-feedback@sentry.io](mailto:performance-feedback@sentry.io).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Sentry provides several tools to explore your application's performance data and uncover problems.

The Performance homepage is our center for monitoring how your application is doing. Here, you can view a list of all your transactions


 and view a summary of any transaction in your application. Learn more about the [Homepage]({% link _documentation/performance-monitoring/performance/index.md %}).

[{% asset performance/perf-homepage.png alt="Example of Performance in Product UI" %}]({% asset performance/perf-homepage.png @path %})

**Discover** is our custom business intelligence query builder that can help you answer questions about your data and analyze metrics. Learn more about [Discover]({% link _documentation/performance-monitoring/discover-queries/index.md %}).

[{% asset discover/discover-results.png alt="Discover page" %}]({% asset discover/discover-results.png @path %})


**Transaction Details** lets you examine an individual transaction event in detail. Here spans are visualized to help you identify slow HTTP requests, slow database queries, and other bottlenecks. You can also jump to other transactions within the trace, and identify associated errors. Learn more about [Distributed Tracing]({% link _documentation/performance-monitoring/distributed-tracing.md %}) and the [Transaction Details page]({% link _documentation/performance-monitoring/distributed-tracing.md %}#transaction-detail-viewpage).

[{% asset performance/perf-event-detail.png alt="Discover page" %}]({% asset performance/perf-event-detail.png @path %})

The Performance Homepage offers [Apdex]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#apdex) and [Throughput]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#throughput-total-rpm-rps) graphs as well as a list of the most problematic transactions to display a high-level report of their overall application health.

## Apdex & Throughput Graphs
The [Apdex]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#apdex) graph displays the ratio of response times in an application measured against a threshold. This information is displayed as an aggregate to provide a sense of how long a customer has waited. For example, if the Apdex score dips significantly during a given time period, you may want to investigate that time period for a potential performance bottleneck.

The Throughput graph indicates the number of transactions over a given time range. You can quickly visualize the traffic patterns in your application and see if a spike in throughput might be correlated with a dip in your Apdex score.

## Transaction Table
Underneath the graphs, view a list of your transactions with the capability to filter down on which transactions you want to view. In this table, sort on the provided columns to understand key characteristics of your transactions like [P95]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#p95-threshold) duration time, [Average Transaction Duration]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#average-transaction-duration) time, or [Throughput]({%- link _documentation/performance-monitoring/performance/metrics.md -%}#throughput-total-rpm-rps).

## My Key Transactions
"My Key Transactions" are transactions that you bookmark and can view in a separate dedicated tab. You may want to bookmark a Transaction as a "Key Transaction" if you monitor performance on a particular transaction or group of transactions. You can set a Transaction as a "Key Transaction" on the Transaction Summary page. The "All Transactions" view also displays these transactions.
