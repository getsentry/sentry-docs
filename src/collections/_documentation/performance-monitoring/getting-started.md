---
title: Getting Started
sidebar_order: 0
---

After this quick setup, you'll have access to [Performance](/performance-monitoring/performance/) and [Discover](/performance-monitoring/discover-queries/). These tools will empower you to see everything from macro-level [metrics](/performance-monitoring/performance/metrics/) to micro-level [spans](/performance-monitoring/performance/event-detail/), but you'll be able to cross-reference [transactions with related issues](/performance-monitoring/performance/transaction-summary/), customize [queries](/performance-monitoring/discover-queries/query-builder/) based on your personal needs, and substantially more. 

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [performance-feedback@sentry.io](mailto:performance-feedback@sentry.io).

Supported SDKs for Tracing
- JavaScript Browser SDK ≥ 5.16.0
- JavaScript Node SDK ≥ 5.16.0
- Python SDK version ≥ 0.11.2
- Javascript React SDK ≥ 5.18.1

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

## Install and Configure an SDK

{% include components/platform_content.html content_dir='configuration' %}
