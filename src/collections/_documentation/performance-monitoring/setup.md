---
title: Setup
sidebar_order: 0
---

Performance monitoring helps developers measure Apdex, Throughput, and trace slow transactions down to the poor performing API call or DB query. Available for both JavaScript and Python SDKs, performance monitoring helps you both diagnose problems and measure your application's overall health. 

Learn more about performance monitoring in:

- [Homepage]({% link _documentation/performance-monitoring/performance/index.md %}): displays a high-level report of application health, including problematic transactions and both Apdex and Throughput graphs
- [Distributed Tracing]({% link _documentation/performance-monitoring/distributed-tracing.md %}): diagnose problems and view interactions across your software systems
- [Metrics]({% link _documentation/performance-monitoring/performance/metrics.md %}): provides insight into user experience of your application based on custom thresholds
- [Discover]({% link _documentation/performance-monitoring/discover-queries/index.md %}): view data across environments with pre-built queries. Customers subscribed to the Team or Business plan can use Discover to view comprehensive information sent to Sentry.


To set up tracing, 

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [performance-feedback@sentry.io](mailto:performance-feedback@sentry.io).

Supported SDKs for Tracing:
- JavaScript Browser SDK ≥ 5.16.0
- JavaScript Node SDK ≥ 5.16.0
- Python SDK version ≥ 0.11.2

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

## Install

{% include components/platform_content.html content_dir='configuration' %}