---
title: Stack Trace Interface
sidebar_order: 4
---

A stack trace contains a list of frames, each with various bits (most optional)
describing the context of that frame. Frames should be sorted from oldest to
newest.

## Attributes

`frames`:

: **Required**. A non-empty list of stack frames (see below). The list is
  ordered from caller to callee, or oldest to youngest. The last frame is the
  one creating the exception.

`registers`:

: _Optional_. A map of register names and their values. The values should
  contain the actual register values of the thread, thus mapping to the last
  frame in the list.

## Frame Attributes

Each object should contain **at least** a `filename`, `function` or
`instruction_addr` attribute. All values are optional, but recommended. 

`filename`:

: The path to the source file relative to the project root directory.

`function`:

: The name of the function being called.

  This function name may be shortened or demangled. If not, Sentry will demangle
  and shorten it. The original function name will be stored in `raw_function`.

`raw_function`:

: The original function name, if the function name is shortened or demangled.
  Sentry shows the raw function when clicking on the shortened one in the UI.

`module`:

: Platform-specific module path (e.g. `sentry.interfaces.Stacktrace`).

`lineno`:

: The line number of the call, starting at 1.

`colno`:

: The column number of the call, starting at 1.

`abs_path`:

: The absolute path to the source file.

`context_line`:

: Source code in filename at `lineno`.

`pre_context`:

: A list of source code lines before `context_line` (in order) – usually
  `[lineno - 5:lineno]`.

`post_context`:

: A list of source code lines after `context_line` (in order) – usually
  `[lineno + 1:lineno + 5]`.

`in_app`:

: Signals whether this frame is related to the execution of the relevant code
  in this stack trace. For example, the frames that might power the framework’s
  web server of your app are probably not relevant. However, calls to the
  framework’s library once you start handling code likely are relevant.

`vars`:

: A mapping of variables which were available within this frame (usually
  context-locals).

The following attributes are primarily used for C-based languages:

`instruction_addr`:

: An optional instruction address for symbolication. This should be a string
  with a hexadecimal number that includes a `0x` prefix. If this is set and a
  known image is defined in the [_Debug Meta Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/debugmeta.md -%}), then
  symbolication can take place.

`symbol_addr`:

: An optional address that points to a symbol. We use the instruction
  address for symbolication, but this can be used to calculate an instruction
  offset automatically.

`image_addr`:

: Optionally an address of the debug image to reference.

`package`:

: The "package" the frame was contained in. Depending on the platform, this can
  be different things. For C#, it can be the name of the assembly. For native
  code, it can be the path of the dynamic library, etc.

`platform`:

: This can override the platform for a single frame. Otherwise, the platform of
  the event is assumed. This can be used for multi-platform stack traces, such
  as in React Native.

## Examples

For the given example program written in Python:

```python
def foo():
  my_var = 'foo'
  raise ValueError()

def main():
  foo()
```

A minimalistic stack trace for the above program in the correct order:

```json
{
  "frames": [
    {"function": "main"},
    {"function": "foo"}
  ]
}
```

The top frame fully populated with five lines of source context:

```json
{
  "frames": [{
    "in_app": true,
    "function": "myfunction",
    "abs_path": "/real/file/name.py",
    "filename": "file/name.py",
    "lineno": 3,
    "vars": {
      "my_var": "'value'"
    },
    "pre_context": [
      "def foo():",
      "  my_var = 'foo'",
    ],
    "context_line": "  raise ValueError()",
    "post_context": [
      "",
      "def main():"
    ],
  }]
}
```

A minimal native stack trace with register values. Note that the `package` event
attribute must be `"native"` for these frames to be symbolicated.

```json
{
  "frames": [
    {"instruction_addr": "0x7fff5bf3456c"},
    {"instruction_addr": "0x7fff5bf346c0"},
  ],
  "registers": {
    "rip": "0x00007ff6eef54be2",
    "rsp": "0x0000003b710cd9e0"
  }
}
```
