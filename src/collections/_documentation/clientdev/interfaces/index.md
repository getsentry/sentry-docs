---
title: Interfaces
sidebar_order: 1
---

Any additional value in the payload of an event which is not an attribute ([_Attributes_]({%- link _documentation/clientdev/attributes.md -%})) is assumed to be a data interface, where the key is the Python path to the interface class name, and the value is the data expected by the interface. Interfaces are used in a variety of ways including storing stacktraces, HTTP request information, and other metadata.

For the most part interfaces are an evolving part of Sentry. Like with attributes, SDKs are expected to assume more can appear at any point in the future. More than that however, for on-premise installations of Sentry the interfaces can be customized so SDK libraries should ideally be written in a way that custom interfaces can be emitted.

Interfaces are typically identified by their full canonical path as it exists in Sentry. For built-in interfaces we also provide aliases which should be used instead. For instance the full canonical path for the stacktrace interface is `sentry.interfaces.Stacktrace` which is also available under the alias `stacktrace`.

## Core Data

-   [Exception Interface]({%- link _documentation/clientdev/interfaces/exception.md -%})
-   [Message Interface]({%- link _documentation/clientdev/interfaces/message.md -%})
-   [Stacktrace Interface]({%- link _documentation/clientdev/interfaces/stacktrace.md -%})
-   [Template Interface]({%- link _documentation/clientdev/interfaces/template.md -%})

## Context

-   [Breadcrumbs Interface]({%- link _documentation/clientdev/interfaces/breadcrumbs.md -%})
-   [Contexts Interface]({%- link _documentation/clientdev/interfaces/contexts.md -%})
-   [HTTP Interface]({%- link _documentation/clientdev/interfaces/http.md -%})
-   [Threads Interface]({%- link _documentation/clientdev/interfaces/threads.md -%})
-   [User Interface]({%- link _documentation/clientdev/interfaces/user.md -%})

## Misc

-   [Debug Interface]({%- link _documentation/clientdev/interfaces/debug.md -%})
-   [Exception Mechanism Interface]({%- link _documentation/clientdev/interfaces/mechanism.md -%})
-   [Repos Interface]({%- link _documentation/clientdev/interfaces/repos.md -%})
-   [SDK Interface]({%- link _documentation/clientdev/interfaces/sdk.md -%})
