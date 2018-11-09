---
title: Interfaces
sidebar_order: 4
---

Any additional value in the payload of an event which is not an attribute (see
[_Attributes_]({%- link _documentation/development/sdk-dev/attributes.md -%})) is assumed
to be a data interface, where the key is the canonical interface short name, and
the value is the data expected by the interface (usually a dictionary).
Interfaces are used in a variety of ways including storing stacktraces, HTTP
request information, and other metadata.

For the most part, interfaces are an evolving part of Sentry. Like with
attributes, SDKs are expected to assume that more interfaces will be added at
any point in the future.

## Core Data

- [Exception Interface]({%- link _documentation/development/sdk-dev/interfaces/exception.md -%})
- [Log Entry Interface]({%- link _documentation/development/sdk-dev/interfaces/message.md -%})
- [Stacktrace Interface]({%- link _documentation/development/sdk-dev/interfaces/stacktrace.md -%})
- [Exception Mechanism Interface]({%- link _documentation/development/sdk-dev/interfaces/mechanism.md -%})
- [Template Interface]({%- link _documentation/development/sdk-dev/interfaces/template.md -%})

## Scope

- [Breadcrumbs Interface]({%- link _documentation/development/sdk-dev/interfaces/breadcrumbs.md -%})
- [Contexts Interface]({%- link _documentation/development/sdk-dev/interfaces/contexts.md -%})
- [HTTP Interface]({%- link _documentation/development/sdk-dev/interfaces/http.md -%})
- [Threads Interface]({%- link _documentation/development/sdk-dev/interfaces/threads.md -%})
- [User Interface]({%- link _documentation/development/sdk-dev/interfaces/user.md -%})

## Misc

- [Debug Interface]({%- link _documentation/development/sdk-dev/interfaces/debug.md -%})
- [SDK Interface]({%- link _documentation/development/sdk-dev/interfaces/sdk.md -%})
