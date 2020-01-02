---
title: Event Payloads
sidebar_order: 3
---

## Required Attributes

Attributes are simple data that Sentry understands to provide the most basic
information about events. These are things like the unique ID of an event or the
time when it occurred.

The following attributes are required for all events.

`event_id`

: Hexadecimal string representing a uuid4 value. The length is exactly 32
  characters. Dashes are not allowed.

  ```json
  {
    "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
  }
  ```

`timestamp`

: Indicates when the logging record was created (in the Sentry SDK). The Sentry
  server assumes the time is in UTC. The timestamp should be in ISO 8601 format,
  without a timezone.

  ```json
  {
    "timestamp": "2011-05-02T17:41:36Z"
  }
  ```

  Alternatively, the timestamp can be specified as floating-point UNIX
  timestamp.

  ```json
  {
    "timestamp": 1304358096000
  }
  ```

`logger`

: The name of the logger which created the record.

  ```json
  {
    "logger": "my.logger.name"
  }
  ```

`platform`

: A string representing the platform the SDK is submitting from. This will be
  used by the Sentry interface to customize various components in the interface.

  ```json
  {
    "platform": "python"
  }
  ```

  Acceptable values are:

  -   `as3`
  -   `c`
  -   `cfml`
  -   `cocoa`
  -   `csharp`
  -   `elixir`
  -   `haskell`
  -   `go`
  -   `groovy`
  -   `java`
  -   `javascript`
  -   `native`
  -   `node`
  -   `objc`
  -   `other`
  -   `perl`
  -   `php`
  -   `python`
  -   `ruby`

## Optional Attributes

Additionally, there are several optional values which Sentry recognizes and are
highly encouraged:

`level`

: The record severity.

  Defaults to `error`.

  The value needs to be one on the supported level string values.

  ```json
  {
    "level": "warning"
  }
  ```

  Acceptable values are:

  -   `fatal`
  -   `error`
  -   `warning`
  -   `info`
  -   `debug`

`transaction`

: The name of the transaction which caused this exception.

  For example, in a web app, this might be the route name.

  ```json
  {
    "transaction": "/users/<username>/"
  }
  ```

`server_name`

: Identifies the host from which the event was recorded.

  ```json
  {
    "server_name": "foo.example.com"
  }
  ```

`release`

: The release version of the application.

  **Release versions must be unique across all projects in your organization**.
  This value can be the git SHA for the given project, or a product identifier
  with a semantic version.

  ```json
  {
    "release": "721e41770371db95eee98ca2707686226b993eda"
  }
  ```

`dist`

: The distribution of the application.

  Distributions are used to disambiguate build or deployment variants of the
  same release of an application. For example, the dist can be the build number
  of an XCode build or the version code of an Android build.

  ```json
  {
    "release": "721e41770371db95eee98ca2707686226b993eda",
    "dist": "14G60"
  }
  ```

`tags`

: A map or list of tags for this event. Each tag must be less than 200 characters.

  ```json
  {
    "tags": {
      "ios_version": "4.0",
      "context": "production"
    }
  }
  ```

`environment`

: The environment name, such as `production` or `staging`.

  ```json
  {
    "environment": "production"
  }
  ```

  {% version_added Sentry: 8.0 %}

`modules`

: A list of relevant modules and their versions.

  ```json
  {
    "modules": {
      "my.module.name": "1.0"
    }
  }
  ```

`extra`

: An arbitrary mapping of additional metadata to store with the event.

  ```json
  {
    "extra": {
      "my_key": 1,
      "some_other_value": "foo bar"
    }
  }
  ```

`fingerprint`

: A list of strings used to dictate the deduplication of this event.

  ```json
  {
    "fingerprint": [
      "myrpc",
      "POST",
      "/foo.bar"
    ]
  }
  ```

  ```json
  {% raw %}{
    "fingerprint": [
      "{{ default }}",
      "http://example.com/my.url"
    ]
  }{% endraw %}
  ```

  {% version_added Protocol: 7 %}

For information about overriding grouping see [Customize Grouping with
Fingerprints]({%- link _documentation/data-management/event-grouping/index.md -%}).

## Core Interfaces

All values in the event payload that are not basic attributes are data
interfaces. The key is the canonical interface short name, and the value is the
data expected by the interface (usually a dictionary).

For the most part, interfaces are an evolving part of Sentry. Like with
attributes, SDKs are expected to assume that more interfaces will be added at
any point in the future.

The core data interfaces are:

 - [Exception Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/exception.md -%})
 - [Message Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/message.md -%})
 - [Stack Trace Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/stacktrace.md -%})
 - [Template Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/template.md -%})


## Scope Interfaces

 - [Breadcrumbs Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/breadcrumbs.md -%})
 - [User Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/user.md -%})
 - [Request Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/request.md -%})
 - [Contexts Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/contexts.md -%})
 - [Threads Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/threads.md -%})

## Other Interfaces

 - [Debug Meta Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/debugmeta.md -%})
 - [SDK Interface]({%- link
   _documentation/development/sdk-dev/event-payloads/sdk.md -%})
