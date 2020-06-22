---
title: Performance Monitoring
sidebar_order: 0
---

Performance monitoring helps developers measure Apdex, Throughput, and trace slow transactions down to the poor performing API call or DB query. Available for both JavaScript and Python SDKs, performance monitoring helps you both diagnose problems and measure your application's overall health. 

Learn more about performance monitoring in:

- [Homepage]({% link _documentation/performance/performance-homepage.md %}): displays a high-level report of application health, including problematic transactions and both Apdex and Throughput graphs
- [Distributed Tracing]({% link _documentation/performance/distributed-tracing.md %}): diagnose problems and view interactions across your software systems
- [Metrics]({% link _documentation/performance/performance-metrics.md %}): provides insight into user experience of your application based on custom thresholds
- [Discover]({% link _documentation/performance/discover/index.md %}): view data across environments with pre-built queries. Customers subscribed to the Team or Business plan can use Discover to view comprehensive information sent to Sentry.

{% include components/platform_content.html content_dir='getting-started' %}

## Navigating Performance Data

Sentry provides several tools to explore your application's performance data and uncover problems.

The **Performance homepage** is our center for monitoring how your application is doing. Here, you can view a list of all your endpoints and transactions and view a summary of any transaction in your application. Learn more about the [Homepage]({% link _documentation/performance/performance-homepage.md %}).

[{% asset performance/performance-homepage-main-example.png alt="Example of Performance in Product UI" %}]({% asset performance/performance-homepage-main-example.png @path %})

**Discover** is our custom business intelligence query builder that can help you answer questions about your data and analyze metrics. Learn more about [Discover]({% link _documentation/performance/discover/index.md %}).

[{% asset performance/discover-main-page-example.png alt="Discover page" %}]({% asset performance/discover-main-page-example.png @path %})


**Transaction Details** lets you examine an individual transaction event in detail. Here spans are visualized to help you identify slow HTTP requests, slow database queries, and other bottlenecks. You can also jump to other transactions within the trace, and identify associated errors. Learn more about [Distributed Tracing]({% link _documentation/performance/distributed-tracing.md %}) and the [Transaction Details page]({% link _documentation/performance/distributed-tracing.md %}#transaction-detail-viewpage).

[{% asset performance/transaction-detail-main-example.png alt="Discover page" %}]({% asset performance/transaction-detail-main-example.png @path %})