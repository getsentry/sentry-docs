---
title: Database
sidebar_order: 50
description: "Learn more about the Database view, which allows you to see your database queries, and debug their performance."
---

If your application queries a database, the **Performance** page surfaces the highest impact queries in the "Most Time Spent in DB Queries" widget. From there, you can click "View All" to open the **Database** page. This page provides insight into the performance of your database queries for the selected project(s). You can also click on a query from the widget to open its **Query Summary** page.

The database widget and pages are only available for backend projects using up-to-date SDK versions. The data shown is pulled from `db` and `db.sql` spans.

- there's a sidebar link to "Database" under "Performance" now, that's another way to access the module

<Note>

The Database page collects queries from your application's endpoints. Queries that run in async tasks are not shown. If a query runs in an endpoint _and_ a task, the metrics will reflect its performance within endpoints only.

</Note>.

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

### Span Eligibility

Sentry tries to extract metrics for all SQL-like dialects. NoSQL databases like MongoDB, graph databases like Neo4j, and other non-SQL database systems are not eligible for this feature. If you are using <PlatformLink to="/performance/instrumentation/automatic-instrumentation">automatic instrumentation</PlatformLink> the database view should work without any configuration. If you've manually instrumented Sentry, you'll need to make sure that your spans conform to our standards for the best experience:

- the span `op` field is set to an [eligible value](https://develop.sentry.dev/sdk/performance/span-operations/#database)
- the span's description contains the full SQL query
- the `db.system` span data value is set to the correct identifier (e.g., `"postgresql"` or `"mysql"`)

### Query Parameterization

In some cases, Sentry processes queries and simplifies them to improve readability. For example:

- Table names are removed from column selections if possible (e.g., `SELECT "users"."name", "users"."id", "users.age" FROM users` becomes `SELECT name, id, age FROM users`)
- Long lists of `SELECT` arguments are collapsed (e.g., `SELECT id, name, age, city, country, phone FROM users` becomes `SELECT .. FROM users`)
- Long lists of `VALUES` arguments are collapsed (e.g., `INSERT INTO users VALUES (%s %s %s %s), (%s %s %s %s)` becomes `INSERT INTO users VALUES ..`)
- `CASE / WHEN` statements are collapsed

You can see the full query by hovering on a truncated description, or clicking it to see its Query Summary page.

### What is Time Spent

- link to `sentry-basics/tracing/distributed-tracing` for help

Every database query takes some time to execute. When an application sends a query, it waits for the database to receive the query, parse it, execute it, and return the result. In Sentry, the total time taken from sending the query to receiving the full result is called the query's "duration". The query's "time spent" is the sum of all of its durations in a given time period.

For example, an application might send a query like `SELECT * FROM users LIMIT 10` every time a user calls the `/users` endpoint. The query might take anywhere from 100ms to 200ms to run, and the endpoint is called anywhere from 10 times a minute to 100 times in a minute depending on the time of day. The query's "time spent" will be the sum of all of its durations that occurred in a given time period. Another way to think about it is that the "total time" is the product of queries per minute and the average duration. In a high-throughput application, a query's time spent might be measured in weeks or months.

"Time spent" is a useful way to measure a query's relative impact, compared to other queries in an application. For example, if one query's "time spent" is 7 days, and another is just 2 hours, the query with more time spent might be more impactful to fix, since even a small improvement in duration would result in a meaningful overall improvement. "Time spent" can also be a strong signal that something is wrong. Queries that suddenly start taking up more time are often a sign of a problem.

- we'll want to link to this section from the product! It's likely that people will land here from the Database page wondering what "Time Spent" means _exactly_, so this section needs to be descriptive

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
