---
title: Visibility
sidebar_order: 4
---

Sentry's new Visibility features help you gain detailed perspectives of your application's health by providing tools to zoom into the code or pull back for a wider angle.

&nbsp;
## Dashboard
{% include components/alert.html
    title="Note"
    content="Available if you're on Business or a Trial, and you're an Early Adopter."
    level="info"
%}

The Dashboard is a compilation of various data visualizations of your aggregate errors across your organization --- including graphs of your errors, geographic mapping, and lists of browsers.

&nbsp;
### Overall View of Application
Each graph and visualization helps uncover crucial patterns and trends about where your customers are hitting errors.
 
[{% asset visibility/dashboard.png alt="Line graphs describing events, events by release, affected users, and handled vs unhandled issues." %}]({% asset visibility/dashboard.png @path %})

&nbsp;
### Dive into Specific Projects
Filter your data with project specific paramaters.

[{% asset visibility/projt-filter.png alt="Drop-down that allows filtering based on projects." %}]({% asset visibility/projt-filter.png @path %})

&nbsp;
### Filter by Environment
Distill needs by choosing explicit environments.

[{% asset visibility/env-filter.png alt="Drop-down that allows filtering based on environment." %}]({% asset visibility/env-filter.png @path %})

&nbsp;
### Refine by Time Period
Define clear time periods for a more clear-cut glimpse.

[{% asset visibility/date-filter.png alt="Drop-down that allows filtering based on calendar dates." %}]({% asset visibility/date-filter.png @path %})
 
&nbsp;
### Query with Discover
Discover is Sentry's built-in query builder, enabling you to uncover patterns and trends in your events data.

[{% asset visibility/discover-query.png alt="Drop-down that allows filtering based on query key words." %}]({% asset visibility/discover-query.png @path %})

&nbsp;
## Discover
{% include components/alert.html
    title="Note"
    content="Available if you're on Business or a Trial, and you're an Early Adopter."
    level="info"
%}

Discover lets you query raw event data in Sentry, across any number of projects within your organization. For more information on how to use the query builder and event fields, see the [full documentation on Discover]({%- link _documentation/workflow/discover.md -%}).

[{% asset visibility/discover-results.png alt="Query results that summarize data for country codes by unique id." %}]({% asset visibility/discover-results.png @path %})

&nbsp;
## Events
{% include components/alert.html
    title="Note"
    content="Available if you're on Business or a Trial, and you're an Early Adopter. The Team pricing level allows you one project on the feed, and the Business and Enterprise levels allow you to view all your projects at once."
    level="info"
%}

The Events View uncovers your raw error stream for any group of projects, including environment or time range.

[{% asset visibility/events-graph.png alt="Line graph illustrating spikes in events for a project. Includes stack trace." %}]({% asset visibility/events-graph.png @path %})




