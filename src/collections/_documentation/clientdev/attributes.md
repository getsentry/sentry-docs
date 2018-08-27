---
title: Attributes
sidebar_order: 1
---

Attributes are simple data that Sentry understands to provide the most basic information about events. These are things like the unique ID of an event, the human readable message etc.

Attributes are separate from [_Interfaces_]({%- link _documentation/clientdev/interfaces/index.md -%}) which provide very specific and tailored data such as exception data, stacktraces, etc.

## Required Attributes

The following attributes are required for all events:

`event_id`

: Hexadecimal string representing a uuid4 value.

  The length is exactly 32 characters (no dashes!)

  ```json
  {
    "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
  }
  ```

`timestamp`

: Indicates when the logging record was created (in the Sentry SDK).

  The Sentry server assumes the time is in UTC.

  The timestamp should be in ISO 8601 format, without a timezone.

  ```json
  {
    "timestamp": "2011-05-02T17:41:36"
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

: A string representing the platform the SDK is submitting from. This will be used by the Sentry interface to customize various components in the interface.

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
  -   `go`
  -   `java`
  -   `javascript`
  -   `node`
  -   `objc`
  -   `other`
  -   `perl`
  -   `php`
  -   `python`
  -   `ruby`

`sdk`

: Information about the SDK sending the event. Note that the `integrations` key is optional and used to list any of the SDK and language specific integrations that the user is actively using.

  ```json
  {
    "sdk": {
      "name": "sentry-java",
      "version": "1.0.0",
      "integrations": ["logback", "spring"] // Optional
    }
  }
  ```

  {% version_added Sentry: 8.4 %}

## Optional Attributes

Additionally, there are several optional values which Sentry recognizes and are highly encouraged:

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

`culprit`

: The name of the transaction (or culprit) which caused this exception.

  For example, in a web app, this might be the route name: `/welcome/`

  ```json
  {
    "culprit": "my.module.function_name"
  }
  ```

`server_name`

: Identifies the host SDK from which the event was recorded.

  ```json
  {
    "server_name": "foo.example.com"
  }
  ```

`release`

: The release version of the application.

  This value will generally be something along the lines of the git SHA for the given project.

  ```json
  {
    "release": "721e41770371db95eee98ca2707686226b993eda"
  }
  ```

`tags`

: A map or list of tags for this event.

  ```json
  {
    "tags": {
      "ios_version": "4.0",
      "context": "production"
    }
  }
  ```

  ```json
  {
    "tags": [
      ["ios_version", "4.0"],
      ["context", "production"]
    ]
  }
  ```

`environment`

: The environment name, such as ‘production’ or ‘staging’.

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

: An array of strings used to dictate the deduplication of this event.

  A value of `{% raw %}{{ default }}{% endraw %}` will be replaced with the built-in behavior, thus allowing you to extend it, or completely replace it.

  ```json
  {
    "fingerprint": ["myrpc", "POST", "/foo.bar"]
  }
  ```

  ```json
  {% raw %}{
    "fingerprint": ["{{ default }}", "http://example.com/my.url"]
  }{% endraw %}
  ```

  {% version_added Protocol: version ‘7’ %}

For information about overriding grouping see [Customize Grouping with Fingerprints]({%- link _documentation/learn/rollups.md -%}#custom-grouping).
