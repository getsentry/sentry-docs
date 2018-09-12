---
title: 'Terminology'
sidebar_order: 7
---

This page lists a few words that you may encounter when reading the sourcecode of one of our SDKs.

- **minimal**: A separate "facade" package that re-exports a subset of the SDK's functionality through interfaces or proxies. That package does not directly depend on the SDK, instead it should make every operation a noop if the SDK is not installed.

  The purpose of such a package is to allow random libraries to record breadcrumbs and set context data while not having a hard dependency on the SDK.

- **hub**: An object that manages the state. An implied global thread local or similar hub exists that can be used by default. Hubs can be created manually.

- **context**: Contexts give extra data to sentry. There are the special contexts (user and similar) and the generic ones (runtime, os, device) etc.  Check out [_Contexts_]({%- link _documentation/clientdev/interfaces/contexts.md -%}) for valid keys. *Note: In older SDKs you might encounter an unrelated concept of context, which is now deprecated by scopes*

- **tags**: Tags can be arbitrary string→string pairs by which events can be searched. Contexts are converted into tags.

- **extra**: Truly arbitrary data attached by client users.

- **scope**: A scope holds data that should implicitly be sent with sentry events. It can hold context data, extra parameters, level overrides, fingerprints etc.

- **client**: A client is an object that is configured once and can be bound to the hub. The user can then auto discover the client and dispatch calls to it.  Users typically do not need to work with the client directly. They either do it via the hub or static convenience functions.

- **client options**: Are parameters that are language and runtime specific and used to configure the client. This can be release and environment but also things like which integrations to configure, how in-app works etc.

- **transport**: The transport is an internal construct of the client that abstracts away the event sending. Typically the transport runs in a separate thread and gets events to send via a queue. The transport is responsible for sending, retrying and handling rate limits. The transport might also persist unsent events across restarts if needed.

- **integration**: Code that provides middlewares, bindings or hooks into certain frameworks or environments, along with code that inserts those bindings and activates them. Usage for integrations does not follow a common interface.
