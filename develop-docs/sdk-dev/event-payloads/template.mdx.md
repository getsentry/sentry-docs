---
title: Template Interface
sidebar_order: 5
---

Template interface is useful for template engine specific reporting when regular stack traces do not contain template data. This, for instance, is required in the Django framework where the templates do not integrate into the Python stack trace.

A rendered template. This is generally used like a single frame in a stack trace
and should only be used if the template system does not provide proper stack
traces otherwise.

## Attributes

The attributes `filename`, `context_line`, and `lineno` are required.

`lineno`:

: The line number of the call.

`abs_path`:

: The absolute path to the template on the file system.

`filename`:

: The filename as it was passed to the template loader.

`context_line`:

: Source code in filename at lineno.

`pre_context`:

: A list of source code lines before `context_line` (in order) – usually
  `[lineno - 5:lineno]`.

`post_context`:

: A list of source code lines after `context_line` (in order) – usually 
  `[lineno + 1:lineno + 5]`.

## Examples

```json
{
  "template": {
    "abs_path": "/real/file/name.html",
    "filename": "file/name.html",
    "lineno": 3,
    "pre_context": [
      "line1",
      "line2"
    ],
    "context_line": "line3",
    "post_context": [
      "line4",
      "line5"
    ],
  }
}
```
