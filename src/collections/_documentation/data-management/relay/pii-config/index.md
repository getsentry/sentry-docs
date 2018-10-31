---
title: 'PII Configuration'
sidebar_order: 4
---

The following document explores the syntax and semantics of PII configs for Relay. To get started with PII configs, it's recommended to use [_Piinguin_](https://getsentry.github.io/piinguin) and refer back to this document when needed.

## A basic example

Say you have an exception message which, unfortunately, contains IP addresses which are not supposed to be there. You'd write:

```json
{
  "applications": {
    "freeform": ["@ip:replace"]
  }
}
```

It reads as "apply rule `@ip:replace` to all fields of kind `freeform`".

## PII kinds

Almost every field in an event has an assigned *PII kind*. The following PII kinds exist:

- `freeform`: Arbitrary text. That might for example be the `message` field of a log entry, or an exception value/message.
- `ip`: Fields containing IP addresses.
- `id`: A user ID, device ID, device ID or similar.
- `username`: A username.
- `hostname`: A hostname.
- `sensitive`: Passwords, secret tokens.
- `email`: An email address.
- `databag`: Local variables in stacktraces, custom data in `extra`.

Note that PII kinds always match on _location_, not on _content_. For example,
the `email` PII kind really only matches on JSON keys where emails are
suspected to be.

## Rules

PII kinds don't employ any kind of pattern matching. That's where PII _rules_
come in. The following rules exist by default:

- `@ip:replace` and `@ip:hash` for pattern-matching IP addresses
- `@imei:replace` and `@imei:hash` for pattern-matching IMEIs
- `@mac:replace`, `@mac:mask` and `@mac:hash` for pattern-matching MAC addresses
- `@email:mask`, `@email:replace` and `@email:hash` for pattern-matching email addresses
- `@creditcard:mask`, `@creditcard:replace` and `@creditcard:hash` for pattern-matching creditcard numbers
- `@userpath:replace` and `@userpath:hash` for pattern-matching local paths (e.g. `C:/Users/foo/`)
- `@password:remove` for pattern matching passwords. In this case we're pattern matching against the field's key, whether it contains `password`, `credentials` or similar strings.

### Writing your own rules

Rules generally consist of two parts:

- *Rule types* describe what to match. See [_PII Rule Types_]({%- link _documentation/data-management/relay/pii-config/types.md -%}) for an exhaustive list.
- *Rule redaction methods* describe what to do with the match. See [_PII Rule Redaction Methods_]({%- link _documentation/data-management/relay/pii-config/methods.md -%}) for a list.  

Each page comes with examples. Try those examples out by pasting them into the "PII config" column of [_Piinguin_](https://getsentry.github.io/piinguin) and clicking on fields to get suggestions.
