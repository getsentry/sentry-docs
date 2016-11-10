Stacktrace Interface
====================

A stacktrace contains a list of frames, each with various bits (most
optional) describing the context of that frame. Frames should be
sorted from oldest to newest.

The stacktrace contains an element, ``frames``, which is a list of
hashes.  Each hash must contain **at least** the ``filename``
attribute. The rest of the values are optional, but recommended.

Additionally, if the list of frames is large, you can explicitly tell
the system that you’ve omitted a range of frames. The
``frames_omitted`` must be a single tuple two values: start and end.
For example, if you only removed the 8th frame, the value would be (8,
9), meaning it started at the 8th frame, and went until the 9th (the
number of frames omitted is end-start). The values should be based on
a one-index.

The list of frames should be ordered by the oldest call first.

Each frame must contain at least one of the following attributes:

``filename``
    The relative filepath to the call
``function``
    The name of the function being called
``module``
    Platform-specific module path (e.g. sentry.interfaces.Stacktrace)

Optional core attributes:

``lineno``
    The line number of the call
``colno``
    The column number of the call
``abs_path``
    The absolute path to filename
``context_line``
    Source code in filename at lineno
``pre_context``
    A list of source code lines before context_line (in order) –
    usually ``[lineno - 5:lineno]``
``post_context``
    A list of source code lines after context_line (in order) –
    usually ``[lineno + 1:lineno + 5]``
``in_app``
    Signifies whether this frame is related to the execution of the
    relevant code in this stacktrace. For example, the frames that
    might power the framework’s webserver of your app are probably not
    relevant, however calls to the framework’s library once you start
    handling code likely are.
``vars``
    A mapping of variables which were available within this frame
    (usually context-locals).

The following attributes are primarily used for C-based languages:

``package``
    The "package" the frame was contained in.  Depending on the
    platform this can be different things.  For C# it can be the name
    of the assembly, for native code it can be the path of the dynamic
    library etc.
``platform``
    This can override the platform for a single frame.  Otherwise the
    platform of the event is assumed.
``image_addr``
    Optionally an address of the debug image to reference.  If this is
    set and a known image is defined by ``debug_meta`` then
    symbolication can take place.
``instruction_addr``
    An optional instruction address for symbolication.  This should be
    a string as hexadecimal number with a ``0x`` prefix.
``symbol_addr``
    An optional address that points to a symbol.  We actually use the
    instruction address for symbolication but this can be used to
    calculate an instruction offset automatically.
``instruction_offset``
    The difference between instruction address and symbol address in
    bytes.

.. sourcecode:: json

    "stacktrace": {
      "frames": [{
        "abs_path": "/real/file/name.py",
        "filename": "file/name.py",
        "function": "myfunction",
        "vars": {
          "key": "value"
        },
        "pre_context": [
          "line1",
          "line2"
        ],
        "context_line": "line3",
        "lineno": 3,
        "in_app": true,
        "post_context": [
          "line4",
          "line5"
        ],
      }],
      "frames_omitted": [13, 56]
    }
