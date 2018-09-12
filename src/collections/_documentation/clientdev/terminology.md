---
title: 'Terminology'
sidebar_order: 7
---

This page lists a few words that you may encounter when reading the sourcecode of one of our SDKs.

- **minimal**: a minimal layer that provides a way to configure data and emit breadcrumbs and events to a configured sentry client. These layers are typically distributed separately or a library can be reconfigured to remove all actual reporting. Names might be minimal, abstraction or interface. 

- **hub**: an object that manages the state. An implied global thread local or similar hub exists that can be used by default. Hubs can be created manually.

- **context**: contexts give extra data to sentry. There are the special contexts (user and similar) and the generic ones (runtime, os, device) etc.  Check out https://docs.sentry.io/clientdev/interfaces/contexts/ for valid keys. *Note: In older SDKs you might encounter an unrelated concept of
  context, which is now deprecated by scopes*

- **tags**: tags can be arbitrary string→string pairs by which events can be searched. Contexts are converted into tags.

- **extra**: truly arbitrary data attached by client users

- **scope**: a scope holds data that should implicitly be sent with sentry events.  It can hold context data, extra parameters, level overrides, fingerprints etc.

- **client**: a client is an object that is configured once and can be bound to the
  hub. The user can then auto discover the client and dispatch calls to it.
  Users typically do not need to work with the client directly. They either do
  it via the hub or static convenience functions. 

- **client options**: are parameters that are language and runtime specific and
  used to configure the client. This can be release and environment but also
  things like which integrations to configure, how in-app works etc.

- **transport**: The transport is an internal construct of the client that abstracts away the event sending. Typically the transport runs in a separate thread and gets events to send via a queue. The transport is responsible for sending, retrying and handling rate limits. The transport might also persist unsent events across restarts if needed.

- **integration**: code that provides middlewares, bindings or hooks into certain frameworks or environments, along with code that inserts those bindings and activates them. Usage for integrations does not follow a common interface.
