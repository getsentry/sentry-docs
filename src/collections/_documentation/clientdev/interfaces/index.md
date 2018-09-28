---
title: Interfaces
sidebar_order: 20
---

Any additional value in the payload of an event which is not an attribute (see
[_Attributes_]({%- link _documentation/clientdev/attributes.md -%})) is assumed
to be a data interface, where the key is the canonical interface short name, and
the value is the data expected by the interface (usually a dictionary).
Interfaces are used in a variety of ways including storing stacktraces, HTTP
request information, and other metadata.

For the most part, interfaces are an evolving part of Sentry. Like with
attributes, SDKs are expected to assume that more interfaces will be added at
any point in the future.

## Core Data

- [Exception Interface]({%- link _documentation/clientdev/interfaces/exception.md -%})
- [Log Entry Interface]({%- link _documentation/clientdev/interfaces/message.md -%})
- [Stacktrace Interface]({%- link _documentation/clientdev/interfaces/stacktrace.md -%})
- [Exception Mechanism Interface]({%- link _documentation/clientdev/interfaces/mechanism.md -%})
- [Template Interface]({%- link _documentation/clientdev/interfaces/template.md -%})

## Scope

- [Breadcrumbs Interface]({%- link _documentation/clientdev/interfaces/breadcrumbs.md -%})
- [Contexts Interface]({%- link _documentation/clientdev/interfaces/contexts.md -%})
- [HTTP Interface]({%- link _documentation/clientdev/interfaces/http.md -%})
- [Threads Interface]({%- link _documentation/clientdev/interfaces/threads.md -%})
- [User Interface]({%- link _documentation/clientdev/interfaces/user.md -%})

## Misc

- [Debug Interface]({%- link _documentation/clientdev/interfaces/debug.md -%})
- [SDK Interface]({%- link _documentation/clientdev/interfaces/sdk.md -%})
