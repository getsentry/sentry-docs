---
title: 'Server-side Fingerprinting'
sidebar_order: 1
---

Server-side fingerprinting is also configured with a config similar to
[grouping enhancements](/data-management/event-grouping/grouping-enhancements/),
but the syntax is slightly different. The matchers are the same
but instead of flipping flags, a fingerprint is assigned that overrides the
default grouping entirely.

These rules can be configured on a per-project basis under *Project Settings > General Settings > Grouping Settings*.

```
(matcher:expression)+ -> list, of, values
```

All values are matched against, and in the case of stack traces, all frames are considered.
If all matches in a line match then the fingerprint is applied.

The matchers are:

- `type`: matches on an exception type
- `value`: matches on an exception value
- `message`: matches on a log message

The matchers also include the following from Custom Grouping Enhancements. See [grouping enhancements](/data-management/event-grouping/grouping-enhancements/#rules) for more info on how they work:

- `family`
- `path`
- `module`
- `function`
- `package`
- `app`



Don't forget that you can also use variables like `{% raw %}{{ function }}{% endraw %}` to
customize fingerprinting like you can do if the client submits them.

## Examples

```{% raw %}
# force all errors of the same type to have the same fingerprint
type:DatabaseUnavailable -> system-down
type:RedisConnectionError -> system-down

# force all events with a certain message to be matched together
message:"unexpected i/o error: *" -> io-error

# group all TimeoutError exceptions by the transaction that caused them
type:TimeoutError -> {{ transaction }}

# group all javascript errors in a module by the topmost module and function name
path:**/some-module/** -> {{ module }}, {{ function }}

# force all memory allocation errors to be grouped together
family:native function:malloc -> memory-allocation-error

# group all allocation errors by the package (dylib, executable) that caused them
function:*alloc* -> {{ package }}
{% endraw %}```
