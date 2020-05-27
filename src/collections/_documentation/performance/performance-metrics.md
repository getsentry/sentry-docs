---
title: 'Performance Metrics'
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

Performance metrics provide insight about how users experience your application. You set the target thresholds, then identify how your application is performing. For example, you can track metrics such as Latency and [Throughput](#throughput-total-rpm-rps) in [Discover]({%- link _documentation/performance/discover/index.md -%}) or Performance. By identifying useful thresholds by which to measure your application, you have a quantifiable measure of your application's health and can more easily identify when errors occur or if performance issues are emerging.

## Apdex
Apdex is an industry-standard metric used to track and measure user satisfaction based on response times in your application. The Apdex score provides the ratio of satisfactory, tolerable, and frustrated requests in a specific transaction or endpoint. This metric provides a standard for you to compare transaction performance, understand which ones may require additional optimization or investigation, and set targets or goals for performance.

- Below are the components of Apdex and its formula:
    - **T**: Threshold for the target response time.
    - **Satisfactory**: Users are satisfied using the app when their page load times are less than or equal to T.
    - **Tolerable**: Users consider the app tolerable to use when their page load times are between T and 4T.
    - **Frustrated**: Users are frustrated with the app when their page load times are greater than T.
    - **Apdex**: (Number of Satisfactory Requests + (Number of Tolerable Requests/2)) / (Number of Total Requests)
    
## Average Transaction Duration
Average Transaction Duration indicates the average response time for all occurrences of a given transaction.
    
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
