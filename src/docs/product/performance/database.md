---
title: Database
sidebar_order: 50
description: "Learn more about the Database view, which allows you to see your database queries, and debug their performance."
---

If your application queries a database, the **Performance** page surfaces the highest impact queries in the "Most Time Spent in DB Queries" widget. From there, you can click "View All" to open the **Database** page. This page provides insight into the performance of your database queries for the selected project(s). You can also click on a query from the widget to open its **Query Summary** page.

The database widget and pages are only available for backend projects using up-to-date SDK versions. The data shown is pulled from `db` and `db.sql` spans.

- link to `sentry-basics/tracing/distributed-tracing` for help

## Database Page

The **Database** page gives you a quick overview of your application's database performance. You can use this page as a starting point to investigate potential problem queries and drill down to better understand how various queries are affecting your app's performance.

At the top of the page, summary graphs for queries per minute (throughput) and average duration provide high-level insight into your database performance. If you see an anomaly or want to investigate a time range further, you can click and drag to select a range directly in a graph to filter data for that time range.

The query description table below shows a list of queries, along with their volume (queries per min), average duration, and the total time your app spent running that query (time spent). The query descriptions are parametrized, so your queries may look slightly different.

By default, this table is sorted by most time spent. This means that queries at the top are usually really slow, very frequent, or both. You can change this to sort by queries per minute to see the most frequently run queries, or by average duration to see the slowest queries.

You can also use the dropdowns above to filter the table for specific SQL commands (such as `SELECT` and `UPDATE`) and tables queried.

To view more details, click on a query from the table to open its **Query Summary** page.

- backend SDKs are eligible
- only `db` and `db.sql` spans
- you need up-to-date SDK versions (maybe I list the exact versions)
- parameterized queries
- you see a list of queries
- you see the average duration of queries
- you see a table of queries sorted by time spent
- you can change the sorting
- filtering by domain or by command

### Query Parameterization

Your queries might not look exactly the same! Click to see details of the query

e.g.,

```sql
SELECT "users"."id", "users.first_name", "users.last_name"
FROM "users"
LIMIT 21
```

becomes

```sql
SELECT ..
FROM users
LIMIT 21
```

- removing parameters
- collapsing long lists of columns
- collapsing long lists of `INSERT` values
- removing table names from the query

### What is Time Spent

- the sum of all your spans
- time spent is the sum of the specific spans

## Query Summary Page

To open a query's **Query Summary** page, click on the query from either the table in the "Most Time Spent in DB Queries" widget on the **Performance** page or the table in the **Database** page.

At the top of the page, queries per minute, average duration, and time spent are shown for the selected time range. The full query is shown below these metrics, followed by graphs for queries per minute and average duration.

At the bottom, you can find a list of endpoints the query is found in, sorted by the most time your application spent in that span.

If you want to investigate a specific endpoint, click on it to open a sidebar showing some sample events.

- query details
- queries per minute
- average duration
- time spent
- QPM
- average duration
- Endpoints List

## Sample List

Click on an endpoint to open its samples list. This side panel shows summary metrics (QPM and average duration) for the query in the specific endpoint.

The table shows a sample list of events, their span duration, and the difference in duration compared to average. This table sorted by longest span duration.

These same events are also represented as triangles shown in the average duration graph above.

You can generate a new list of random sample events by clicking the "Try Different Samples" button at the bottom.

From sample list, you can drill down to specific good, average, or bad examples of a given query within a given endpoint. Click on an event ID to drill into the query's span details within the span waterfall of the **Event Details** page.

- QPM
- Avg Duration
- Duration Chart
- Samples above, below, etc.
- Links to specific events

## UI Walkthrough

- Add arcade
- Also should add screenshots for each view in the appropriate sections

## Troubleshooting

- Any troubleshooting info we want to add (custom instrumentation, cardinality issues)
