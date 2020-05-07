---
title: 'Performance Metrics'
sidebar_order: 2
---

Sentry's application monitoring product collects performance metrics. Performance metrics provide a better understanding of how users are interacting with your application. By tracking metrics like Latency and Throughput in [Discover]({%- link _documentation/performance/discover/index.md -%}) or Performance, Sentry provides you with a fuller, real-time picture of your application's health, such as the occurrence of errors or performance issues.

## Apdex
Apdex is an industry-standard metric used to track and measure user satisfaction based on response times in your application. Your Apdex score is a measurement of the ratio of satisfactory, tolerable, and frustrated requests in a specific transaction or endpoint. This metric provides a standard for you to compare transaction performance, understand which ones may require additional optimization or investigation, and set targets or goals for performance.

- Below are the various components of Apdex and its formula:
    - T = Response time threshold for your target response time
    - Satisfactory = T
    - Tolerable = >T and ≤ 4*T
    - Frustrated = 4*T
    - Apdex = (# of Satisfactory Requests + (# of Tolerable Requests/2)) / (# of Total Requests)
    
## Average Transaction Duration
Average Transaction Duration indicates the average response time for all occurrences of a given transaction
    
## P75 Threshold
The P75 Threshold indicates that 25% of transaction durations are greater than the threshold. For example, if the P75 is ten milliseconds, then 25% of transactions took longer than ten milliseconds.

## P95 Threshold
The P95 Threshold indicates that 5% of transaction durations are greater than the threshold. For example, if the P95 is 50 milliseconds, then 5% of transactions took longer than 50 milliseconds.

## P99 Threshold
The P99 Threshold indicates that 1% of transaction durations are greater than the threshold. For example, if the P99 is 5 seconds, then 1% of transactions took longer than 5 seconds.

## Throughput (Total, RPM, RPS)
Throughput indicates the number of requests over a given time range (Total), most common requests per minute (RPM), or requests per second (RPS)
    
## User Misery
User Misery is a user-weighted performance metric to assess the relative magnitude of your application performance. While you can measure the ratio of various response time threshold levels with Apdex, Impact score adds the number of users impacted and volume so you can better highlight transactions that have the highest throughput of users affected.