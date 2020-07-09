---
title: Getting Started
sidebar_order: 0
---

After this quick setup, you'll have access to [Performance](/performance-monitoring/performance/). This tool will empower you to see everything from macro-level [metrics](/performance-monitoring/performance/metrics/) to micro-level [spans](/performance-monitoring/performance/event-detail/), but you'll be able to cross-reference [transactions with related issues](/performance-monitoring/performance/transaction-summary/), customize [queries](/performance-monitoring/discover-queries/query-builder/) based on your personal needs, and substantially more. 

{% capture __alert_content -%}
- JavaScript Browser SDK ≥ 5.16.0
- JavaScript Node SDK ≥ 5.16.0
- Python SDK version ≥ 0.11.2
- Javascript React SDK ≥ 5.18.1

{%- endcapture -%}
{%- include components/alert.html
    title="Supported SDKs for Tracing"
    content=__alert_content
    level="warning"
%}

## Install and Configure an SDK

{% include components/platform_content.html content_dir='configuration' %}
