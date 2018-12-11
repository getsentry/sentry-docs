---
title: 'PII Rule Types'
sidebar_order: 5
---

{:.config-key}
#### pattern

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
    "text": ["hash_device_id"]
  }
}
```

{:.config-key}
#### imei

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
    "text": ["hash_imei"]
  }
}
```

{:.config-key}
#### mac

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
    "text": ["hash_mac"]
  }
}
```

{:.config-key}
#### ip

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
    "text": ["hash_ip"]
  }
}
```

{:.config-key}
#### creditcard

Matches a creditcard number.

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
    "text": ["hash_cc"]
  }
}
```

{:.config-key}
#### userpath

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
    "text": ["hash_userpath"]
  }
}
```

{:.config-key}
#### anything

Matches any value. This is basically equivalent to a wildcard regex.

For example, to remove all data with the PII kind `text`:

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
    "text": ["remove_everything"]
  }
}
```

{:.config-key}
#### multiple

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
    "text": ["remove_ips_and_macs"]
  }
}
```

{:.config-key}
#### alias

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
    "text": ["remove_ips"]
  }
}
```

{:.config-key}
#### redact_pair

Apply a regex to the key name. The value matches if the key matches the given regex. This is useful for removing tokens and keys, since those are usually completely random.

```json
{
  "applications": {
    "container": [
      "remove_all_passwords"
    ]
  },
  "rules": {
    "remove_all_passwords": {
      "keyPattern": "(password|token|credentials)",
      "type": "redact_pair"
    }
  }
}
```
