---
title: Database
sidebar_order: 50
description: "Learn more about the Database view, which allows you to see your database queries, and debug their performance."
---

The **Database** page shows you your queries!

- link to `sentry-basics/tracing/distributed-tracing` for help

## Database Module Landing Page

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

- query details
- queries per minute
- average duration
- time spent
- QPM
- average duration
- Endpoints List

## Sample List

- QPM
- Avg Duration
- Duration Chart
- Samples above, below, etc.
- Links to specific events
