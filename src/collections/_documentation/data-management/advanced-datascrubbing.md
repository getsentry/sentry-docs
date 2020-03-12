---
title: 'Advanced Data Scrubbing (Beta)'
sidebar_order: 4
keywords: ["pii", "gdpr", "personally identifiable data", "compliance"]
---

In addition to using [`beforeSend`]({% link _documentation/data-management/sensitive-data.md %}#custom-event-processing-in-the-sdk) in your SDK or our [server-side data scrubbing features]({% link _documentation/data-management/sensitive-data.md %}#server-side-scrubbing) to redact sensitive data, we are currently beta-testing ways to give you more granular control over server-side data scrubbing of your events. Additional functionality includes:

* Define custom regular expressions to match on sensitive data
* Detailed tuning on which parts of an event to scrub
* Partial removal or hashing of sensitive data instead of deletion

## Overview

**Advanced Data Scrubbing is available only if your organization is enabled as an Early Adopter.** To enable this option, navigate to your organization's settings and enable the "Early Adopter" option. Turning on this option allows access to features prior to full release, and can be disabled at any time.

Early adopters have access to a new option ("Advanced datascrubber configuration") in both organization settings as well as the setting of each project, which accepts JSON-based configuration as described in the next section.

Note that everything you configure there will have direct impact on all new events, just as all the other data privacy-related settings do. However, it is not possible to break or undo any other data privacy settings that you may have configured. In other words, it is only possible to accidentally remove too much data, not too little.

If you have any questions related to this feature, feel free to contact us at `markus@sentry.io`.

## A Basic Example

One example is an exception message that includes an IP address that needs to be removed. In this example, you'd write:

```json
{
  "applications": {
    "$string": ["@ip:replace"]
  }
}
```

It reads as "replace all IP addresses in all strings", or "apply `@ip:replace` to all `$string` fields".

`@ip:replace` is called a rule, and `$string` is a [_selector_](#selectors).

## Built-In Rules

The following rules can be used by default:

- `@ip:replace` and `@ip:hash` for replacing IP addresses.
- `@imei:replace` and `@imei:hash` for replacing IMEIs
- `@mac:replace`, `@mac:mask` and `@mac:hash` for matching MAC addresses
- `@email:mask`, `@email:replace` and `@email:hash` for matching email addresses
- `@creditcard:mask`, `@creditcard:replace` and `@creditcard:hash` for matching credit card numbers
- `@userpath:replace` and `@userpath:hash` for matching local paths (e.g. `C:/Users/foo/`)
- `@password:remove` for removing passwords. In this case we're pattern matching against the field's key, whether it contains `password`, `credentials` or similar strings.
- `@anything:remove`, `@anything:replace` and `@anything:hash` for removing, replacing or hashing any value. It is essentially equivalent to a wildcard-regex, but it will also match much more than strings.

## Writing Your Own Rules

Rules generally consist of two parts:

- *Rule types* describe what to match. See [_Rule Types_](#rule-types) for an exhaustive list.
- *Rule redaction methods* describe what to do with the match. See [_Redaction Methods_](#redaction-methods) for a list.

Each page comes with examples. Try those examples out by pasting them into the "PII config" column of [_Piinguin_](https://getsentry.github.io/piinguin) and clicking on fields to get suggestions.

## Selectors

You can select a region of the event using JSON-path-like syntax. As an example, to delete a specific key in "Additional Data":

```json
{
  "applications": {
    "extra.foo": ["@anything:remove"]
  }
}
```

### Boolean Logic

You can combine selectors using boolean logic.

* Prefix with `!` to invert the selector. `foo` matches the JSON key `foo`, while `(~foo)` matches everything but `foo`.
* Build the conjunction (AND) using `&&`, such as: `foo && !extra.foo` to match the key `foo` except when inside of `extra`.
* Build the disjunction (OR) using `||`, such as: `foo || bar` to match `foo` or `bar`.

### Wildcards

* `**` matches all subpaths, so that `foo.**` matches all JSON keys within `foo`.
* `*` matches a single path item, so that `foo.*` matches all JSON keys one level below `foo`.

### Value Types

Select subsections by JSON-type or semantic meaning using the following:

* `$string`
* `$number`
* `$boolean`
* `$datetime`
* `$array`
* `$object`
* `$event`
* `$exception`
* `$stacktrace`
* `$frame`
* `$request`
* `$user`
* `$logentry` (also applies to `event.message`)
* `$thread`
* `$breadcrumb`
* `$span`
* `$sdk`

Examples:

* Delete `event.user`:

  ```json
  {
    "applications": {
      "$user": ["@anything:remove"]
    }
  }
  ```

* Delete all frame-local variables:

  ```json
  {
    "applications": {
      "$frame.vars": ["@anything:remove"]
    }
  }
  ```

### Escaping Specal Characters

If the object key you want to match contains whitespace or special characters, you can use quotes to escape it:

```json
{
  "applications": {
    "extra.'my special value'": ["@anything:remove"]
  }
}
```

To escape `'` within the quotes, replace it with `''`.

## Rule Types

### `pattern`

Custom Perl-style regex (PCRE).

```json
{
  "rules": {
    "hash_device_id": {
      "type": "pattern",
      "pattern": "d/[a-f0-9]{12}",
      "redaction": {
        "method": "hash"
      }
    }
  },
  "applications": {
    "$string": ["hash_device_id"]
  }
}
```

### `imei`

Matches an IMEI or IMEISV.

```json
{
  "rules": {
    "hash_imei": {
      "type": "imei",
      "redaction": {
        "method": "hash"
      }
    }
  },
  "applications": {
    "$string": ["hash_imei"]
  }
}
```

### `mac`

Matches a MAC address.

```json
{
  "rules": {
    "hash_mac": {
      "type": "mac",
      "redaction": {
        "method": "hash"
      }
    }
  },
  "applications": {
    "$string": ["hash_mac"]
  }
}
```

### `ip`

Matches any IP address.

```json
{
  "rules": {
    "hash_ip": {
      "type": "ip",
      "redaction": {
        "method": "hash"
      }
    }
  },
  "applications": {
    "$string": ["hash_ip"]
  }
}
```

### `creditcard`

Matches a credit card number.

```json
{
  "rules": {
    "hash_cc": {
      "type": "creditcard",
      "redaction": {
        "method": "hash"
      }
    }
  },
  "applications": {
    "$string": ["hash_cc"]
  }
}
```

### `userpath`

Matches a local path (e.g. `C:/Users/foo/`).

```json
{
  "rules": {
    "hash_userpath": {
      "type": "userpath",
      "redaction": {
        "method": "hash"
      }
    }
  },
  "applications": {
    "$string": ["hash_userpath"]
  }
}
```

### `anything`

Matches any value. This is basically equivalent to a wildcard regex.

For example, to remove all strings:

```json
{
  "rules": {
    "remove_everything": {
      "type": "anything",
      "redaction": {
        "method": "remove"
      }
    }
  },
  "applications": {
    "$string": ["remove_everything"]
  }
}
```

### `multiple`

Combine multiple rules into one. This is a disjunction (OR): The field in question has to match only one of the rules to match the combined rule, not all of them.

```javascript
{
  "rules": {
    "remove_ips_and_macs": {
      "type": "multiple",
      "rules": [
        "@ip",
        "@mac"
      ],
      "hide_rule": false,  // Hide the inner rules when showing which rules have been applied. Defaults to false.
      "redaction": {
        "method": "remove"
      }
    }
  },
  "applications": {
    "$string": ["remove_ips_and_macs"]
  }
}
```

### `alias`

Alias one rule to the other. This is the same as `multiple` except that you can only wrap one rule.

```javascript
{
  "rules": {
    "remove_ips": {
      "type": "multiple",
      "rule": "@ip",
      "hide_rule": false,  // Hide the inner rule when showing which rules have been applied. Defaults to false.
      "redaction": {
        "method": "remove"
      }
    }
  },
  "applications": {
    "$string": ["remove_ips"]
  }
}
```

## Redaction Methods

### `remove`

Remove the entire field. Relay may choose to either set it to `null` or to remove it entirely.
  
```json
{
  "rules": {
    "remove_ip": {
      "type": "ip",
      "redaction": {
        "method": "remove"
      }
    }
  },
  "applications": {
    "$string": ["remove_ip"]
  }
}
```

### `replace`

Replace the key with a static string.

```json
{
  "rules": {
    "replace_ip": {
      "type": "ip",
      "redaction": {
        "method": "replace",
        "text": "[censored]"
      }
    }
  },
  "applications": {
    "$string": ["replace_ip"]
  }
}
```

### `mask`

Replace every character of the matched string with a "masking" char. Compared to `replace` this preserves the length of the original string.

```javascript
{
  "rules": {
    "mask_ip": {
      "type": "ip",
      "redaction": {
        "method": "mask",
        "mask_char": "0",        // The character used for masking. Optional, default "*"
        "chars_to_ignore": ".",  // Which characters to ignore. Optional, default empty
        "range": [0, -1]         // Which range of the string to replace. Optional, defaults to full range. Negative indices count from the matches' end.
      }
    }
  },
  "applications": {
    "$string": ["mask_ip"]
  }
}
```

### `hash`

Replace the string with a hashed version of itself. Equal strings will produce the same hash, so if you, for example, decide to hash the user ID instead of replacing or removing it, you will still have an accurate count of users affected.

```javascript
{
  "rules": {
    "hash_ip": {
      "type": "ip",
      "redaction": {
        "method": "hash",
        "algorithm": "HMAC-SHA1", // One of "HMAC-SHA1", "HMAC-SHA256", "HMAC-SHA512"
        "key": "myOverriddenKey"  // A key to salt the hash with. Defaults to the default key set in "vars"
      }
    }
  },
  "vars": {
    "hashKey": "myDefaultKey"    // The default key to use
  }
  "applications": {
    "$string": ["mask_ip"]
  }
}
```
