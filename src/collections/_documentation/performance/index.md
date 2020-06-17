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

## Getting Started with Performance for JavaScript

To get started with performance monitoring, first install the `@sentry/tracing package:`

```bash
npm install --save @sentry/tracing
```

Next, initialize the integration in your call to `Sentry.init`:

```jsx
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/tracing';
Sentry.init({
  dsn: '<https://bc367fd982144d75923219dca8f35ad1@o1.ingest.sentry.io/2783252>',
  release: 'my-project-name@' + process.env.npm_package_version,
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25, // must be present and non-zero
});
```

Performance data is transmitted using a new event type called called "transactions", which you can learn about in [Distributing Tracing]({%- link _documentation/performance/distributed-tracing.md %}#traces-transactions-and-spans). **To sample transactions, you must set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured transactions.

Learn more about sampling in [Using Your SDK to Filter Events]({%- link _documentation/error-reporting/configuration/filtering.md %}).

## Getting Started with Performance for Python

<!---note this will be a toggle to select between JS and Python)-->

To get started with performance monitoring, first install the `@sentry/tracing package:`

```
import sentry_sdk
```

Next, initialize the integration in your call to `Sentry.init`:

```
sentry_sdk.init(
    "https://bc367fd982144d75923219dca8f35ad1@o1.ingest.sentry.io/2783252", 
    traces_sample_rate = 0.25
)
```

Performance data is transmitted using a new event type called "transactions", which you can learn about in [Distributing Tracing]({%- link _documentation/performance/distributed-tracing.md %}#traces-transactions-and-spans). **To sample transactions, you must set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured traces.

Learn more about sampling in [Using Your SDK to Filter Events]({%- link _documentation/error-reporting/configuration/filtering.md %}).

## Navigating Performance Data

Sentry provides several tools to explore your application's performance data and uncover problems.

The **Performance homepage** is our center for monitoring how your application is doing. Here, you can view a list of all of your endpoints and transactions and view a summary of any transaction in your application. Learn more about the [Homepage]({% link _documentation/performance/performance-homepage.md %}).

[{% asset performance/performance-homepage-main-example.png alt="Example of Performance in Product UI" %}]({% asset performance/performance-homepage-main-example.png @path %})

**Discover** is our custom business intelligence query builder that can help you answer questions about your data and analyze metrics. Learn more about [Discover]({% link _documentation/performance/discover/index.md %}).

[{% asset performance/discover-main-page-example.png alt="Discover page" %}]({% asset performance/discover-main-page-example.png @path %})


**Transaction Details** lets you examine an individual transaction event in detail. Here spans are visualized to help you identify slow HTTP requests, slow database queries, and other bottlenecks. You can also jump to other transactions within the trace, and identify associated errors. Learn more about [Distributed Tracing]({% link _documentation/performance/distributed-tracing.md %}) and the [Transaction Details page]({% link _documentation/performance/distributed-tracing.md %}#transaction-detail-viewpage).

[{% asset performance/transaction-detail-main-example.png alt="Discover page" %}]({% asset performance/transaction-detail-main-example.png @path %})