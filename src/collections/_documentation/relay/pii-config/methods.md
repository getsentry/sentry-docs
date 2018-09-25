---
title: 'PII Rule Redaction Methods'
sidebar_order: 6
---

{:.config-key}
#### remove

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
    "freeform": ["remove_ip"]
  }
}
```

{:.config-key}
#### replace

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
    "freeform": ["replace_ip"]
  }
}
```

{:.config-key}
#### mask

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
    "freeform": ["mask_ip"]
  }
}
```

{:.config-key}
#### hash

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
    "freeform": ["mask_ip"]
  }
}
```
