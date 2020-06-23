---
title: 'Performance Metrics'
sidebar_order: 1
---
{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [performance-feedback@sentry.io](mailto:performance-feedback@sentry.io).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Performance metrics provide insight about how users experience your application. You set the target thresholds, then identify how your application is performing. For example, you can track metrics such as Latency and [Throughput](#throughput-total-rpm-rps) in [Discover]({%- link _documentation/performance/discover/index.md -%}) or Performance. By identifying useful thresholds by which to measure your application, you have a quantifiable measure of your application's health and can more easily identify when errors occur or if performance issues are emerging.

## Apdex
Apdex is an industry-standard metric used to track and measure user satisfaction based on response times in your application. The Apdex score provides the ratio of satisfactory, tolerable, and frustrated requests in a specific transaction or endpoint. This metric provides a standard for you to compare transaction performance, understand which ones may require additional optimization or investigation, and set targets or goals for performance.

- Below are the components of Apdex and its formula:
    - **T**: Threshold for the target response time.
    - **Satisfactory**: Users are satisfied using the app when their page load times are less than or equal to T.
    - **Tolerable**: Users consider the app tolerable to use when their page load times are between T and 4T.
    - **Frustrated**: Users are frustrated with the app when their page load times are greater than T.
    - **Apdex**: (Number of Satisfactory Requests + (Number of Tolerable Requests/2)) / (Number of Total Requests)
    
## Failure Rate
`failure_rate()` indicates the percentage of unsuccessful transactions. Sentry treats transactions with a status other than “ok,” “canceled,” and “unknown” as failures. For more details, see a [list of possible status values](https://develop.sentry.dev/sdk/event-payloads/span/).
    
## P75 Threshold
The P75 Threshold indicates that 25% of transaction durations are greater than the threshold. For example, if the P75 threshold is set to 10 milliseconds, then 25% of transactions exceeded that threshold, taking longer than 10 milliseconds.

## P95 Threshold
The P95 Threshold indicates that 5% of transaction durations are greater than the threshold. For example, if the P95 threshold is 50 milliseconds, then 5% of transactions exceeded that threshold, taking longer than 50 milliseconds.

## P99 Threshold
The P99 Threshold indicates that 1% of transaction durations are greater than the threshold. For example, if the P99 threshold is 5 seconds, then 1% of transactions exceeded that threshold, taking longer than 5 seconds.

## Throughput (Total, TPM, TPS)
Throughput indicates the number of transactions over a given time range (Total), average transactions per minute (TPM), or average transactions per second (TPS).
    
## User Misery
User Misery is a user-weighted performance metric to assess the relative magnitude of your application performance. While you can examine the ratio of various response time threshold levels with [Apdex](#apdex), User Misery counts the number of unique users who were frustrated based on the specified response time threshold. User Misery highlights transactions that have the highest impact on users.

## Transaction Metrics
By enabling [tracing]({%- link _documentation/performance/distributed-tracing.md -%}), you can see a number of the metrics available as column choices in the [transaction list view]({%- link _documentation/performance/distributed-tracing.md -%}#transaction-list-view).

### Transaction Duration

Average Transaction Duration indicates the average response time for all occurrences of a given transaction.

The following functions aggregate transaction durations:

- average
- various percentiles (by default, the pre-built Transactions query shows the 75th and 95th percentiles, but there are many other options, including a custom percentile)
- maximum

One use case for tracking these statistics is to help you identify transactions that are slower than your organization's target Service Level Agreements (SLAs).

A word of caution when looking at averages and percentiles: In most cases, you'll want to set up tracing so that only [a fraction](#data-sampling) of possible traces are actually sent to Sentry, to avoid overwhelming your system. Further, you may want to filter your transaction data by date or other factors, or you may be tracing a relatively uncommon operation. For all of these reasons, you may end up with average and percentile data that is directionally correct, but not accurate. (To use the most extreme case as an example, if only a single transaction matches your filters, you can still compute an "average" duration, even though that's clearly not what is usually meant by "average.")

The problem of small sample size (and the resulting inability to be usefully accurate) will happen more often for some metrics than others, and sample size will also vary by row. For example, it takes less data to calculate a meaningful average than it does to calculate an equally meaningful 95th percentile. Further, a row representing requests to `/settings/my-awesome-org/` will likely contain many times as many transactions as one representing requests to `/settings/my-awesome-org/projects/best-project-ever/`.

### Transaction Frequency

The following functions aggregate transaction counts and the rate at which transactions are recorded:

- count
- count unique values (for a given field)
- average requests (transactions) per second
- average requests (transactions) per minute

Each of these functions is calculated with respect to the collection of transactions within the given row, which means the numbers will change as you filter your data or change the time window. Also, if you have set up your SDK to [sample your data]({%- link _documentation/performance/distributed-tracing.md -%}#data-sampling), remember that only the transactions that are sent to Sentry are counted. So if a row containing transactions representing requests to a given endpoint is calculated to be receiving 5 requests per second, and you've got a 25% sampling rate enabled, in reality you're getting approximately 20 requests to that endpoint each second. (20 because you're collecting 25% - or 1/4 - of your data, so your real volume is 4 times what you're seeing in Sentry.)