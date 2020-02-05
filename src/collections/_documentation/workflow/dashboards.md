---
title: Dashboards
sidebar_order: 6
---

Sentry's Dashboards help you gain detailed perspectives of your application's health by providing filtering tools to navigate your issues across multiple projects in a single view.

{% include components/alert.html
    title="Note"
    content="Available if you're on a Business plan or a Trial."
    level="info"
%}

Dashboards are various data visualizations of your errors across your organization --- including graphs of your errors, geographic mapping, and lists of browsers. Dashboards allow you to drill into data by selecting points of interest.

### Overall View of Application
Each graph and visualization helps uncover crucial patterns and trends about where your customers are hitting errors.

[{% asset visibility/dashboard.png alt="Line graphs describing events, events by release, affected users, and handled vs unhandled issues." %}]({% asset visibility/dashboard.png @path %})

### Dive into Specific Projects
Filter your data with project-specific parameters.

[{% asset visibility/projt-filter.png alt="Drop-down that allows filtering based on projects." %}]({% asset visibility/projt-filter.png @path %})

### Filter by Environment
Distill needs by choosing explicit environments.

[{% asset visibility/env-filter.png alt="Drop-down that allows filtering based on environment." %}]({% asset visibility/env-filter.png @path %})

### Refine by Time Period
Define distinct time periods for a more clear-cut glimpse.

[{% asset visibility/date-filter.png alt="Drop-down that allows filtering based on calendar dates." %}]({% asset visibility/date-filter.png @path %})
