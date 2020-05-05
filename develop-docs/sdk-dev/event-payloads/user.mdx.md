---
title: User Interface
sidebar_order: 7
---

An interface which describes the authenticated User for a request.

You should provide at least either an `id` (a unique identifier for an
authenticated user) or `ip_address` (their IP address).

## Attributes

`id`:

: The unique ID of the user.

`email`:

: The email address of the user.

`ip_address`:

: The IP of the user.

`username`:

: The username of the user.

All other keys are stored as extra information but not specifically processed by
Sentry.

## Examples

```json
{
  "user": {
    "id": "unique_id",
    "username": "my_user",
    "email": "foo@example.com",
    "ip_address": "127.0.0.1",
    "subscription": "basic"
  }
}
```
