---
title: Session Fields
sidebar_order: 6
---

`sid` (optional)

Session ID (unique and client-generated). Clients are allowed to skip it if the initial session state is `exited`.

`did` (optional, distinct ID)

The distinct ID. It should be a device or a user ID.

`seq` (optional)

A logical clock optionally. Defaults to the current UNIX timestamp in milliseconds during ingestion.

`timestamp` (optional)

The timestamp of when the session change event came in. Must be an ISO string for now. If not sent, the server can assume the current UTC timestamp. In the data model, this is called `received`.

`started`

Timestamp when the session started. Must be an ISO string for now.

`init` (optional, default is `false`)

If this is set to `true`, it means that this was the first event of the session. This lets the server optimize the session counts because no deduplication is needed (client is authoritative anyways). Internally when this flag is set, `seq` is changed to `0` on processing.

`duration` (optional)

An optional field that can transmit the session duration when the event was received. This can be client-controlled. For instance, inactive time can be subtracted.

`status` (optional, default = `ok`)

The current status of the session. A session can only be in two states effectively: `ok`, which means the session is alive or one of the terminal states. When a session is moved away from `ok`, it must not be updated any more.

`ok` = 0

The session is currently in progress but healthy. This can be the terminal state of a session.

`exited` = 1

The session terminated normally.

`crashed` = 2

The session terminated in a crash.

`abnormal` = 3

The session encountered a non-crash related abnormal exit.

`errors` (optional, default = 0)

A running counter of errors encountered while this session was ongoing. This counter **must** also be incremented when a session goes to `crashed`. For example, the crash itself is always an error, as well. Ingest should force `errors` to 1 if not set or 0.

`attrs` (all optional)

- `release`: a sentry release ID (`release`)
- `environment`: a sentry environment (`environment`)
- `ip_address`: the primary IP address to be considered. This is normally the IP of the user. This data is not persisted but used for filtering.
    - Mobile is not required to send it; it's received by the server
- `user_agent`: the user agent to be considered. This is normally the user agent of the user that caused the session. This data is not persisted but used for filtering.
