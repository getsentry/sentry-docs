Interfaces
==========

Any additional value in the payload of an event which is not an attribute
(:doc:`attributes`) is assumed to be a data interface, where the key is
the Python path to the interface class name, and the value is the data
expected by the interface.  Interfaces are used in a variety of ways
including storing stacktraces, HTTP request information, and other
metadata.

For the most part interfaces are an evolving part of Sentry.  Like with
attributes, clients are expected to assume more can appear at any point in
the future.  More than that however, for on-premise installations of
Sentry the interfaces can be customized so client libraries should ideally
be written in a way that custom interfaces can be emitted.

Interfaces are typically identified by their full canonical path as it
exists in Sentry.  For built-in interfaces we also provide aliases which
should be used instead.  For instance the full canonical path for the
stacktrace interface is ``sentry.interfaces.Stacktrace`` which is also
available under the alias ``stacktrace``.

For custom interfaces in on-premise installations aliases are typically
not configured.  All interfaces on this page here are built into Sentry
and available on all installation.

Message Interface
-----------------

The message interface is a slightly improved version of the ``message``
attribute and can be used to split the log message from the log message
parameters:

.. describe:: sentry.interfaces.message.Message

    Alias: ``logentry``

    A standard message consisting of a ``message`` argugment, and an
    optional list of ``params`` for formatting.  The regular Python
    format string is supported (``%s``, ``%d`` etc.).

    If your message cannot be parameterized, then the message interface
    will serve no benefit.

    ``message`` must be no more than 1000 characters in length.

    .. sourcecode:: json

        {
          "message": "My raw message with interpreted strings like %s",
          "params": ["this"]
        }

Failure Interfaces
------------------

These interfaces are related to reporting of failures (errors, exceptions)
in an application.

.. describe:: sentry.interfaces.exception.Exception

    Alias: ``exception``

    An exception consists of a list of values. In most cases, this list
    contains a single exception, with an optional stacktrace interface.

    Each exception has a mandatory ``value`` argument and optional
    ``type`` and ``module`` arguments describing the exception class type
    and module namespace.

    You can also optionally bind a stacktrace interface to an exception.
    The spec is identical to ``sentry.interfaces.Stacktrace``.

    .. sourcecode:: json

        {
          "values": [{
            "type": "ValueError",
            "value": "My exception value",
            "module": "__builtins__"
            "stacktrace": {
              "see": "sentry.interfaces.Stacktrace"
            }
          }]
        }

.. describe:: sentry.interfaces.stacktrace.Stacktrace

    Alias: ``stacktrace``

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

    The following additional attributes are supported:

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

    .. sourcecode:: json

        {
          "frames": [{
            "abs_path": "/real/file/name.py"
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

Template Interface
------------------

This interface is useful for template engine specific reporting when
regular stacktraces do not contain template data.  This for instance is
required in the Django framework where the templates do not integrate into
the Python stacktrace.

.. describe:: sentry.interfaces.template.Template

    Alias: ``template``

    A rendered template.  This is generally used like a single frame in a
    stacktrace and should only be used if the template system does not
    provide proper stacktraces otherwise.

    The attributes ``filename``, ``context_line``, and ``lineno`` are
    required.

    ``lineno``
        The line number of the call
    ``abs_path``
        The absolute path to the template on the file system
    ``filename``
        The filename as it was passed to the template loader
    ``context_line``
        Source code in filename at lineno
    ``pre_context``
        A list of source code lines before context_line (in order) –
        usually ``[lineno - 5:lineno]``
    ``post_context``
        A list of source code lines after context_line (in order) –
        usually ``[lineno + 1:lineno + 5]``

    .. sourcecode:: json

        {
          "abs_path": "/real/file/name.html"
          "filename": "file/name.html",
          "pre_context": [
            "line1",
            "line2"
          ],
          "context_line": "line3",
          "lineno": 3,
          "post_context": [
            "line4",
            "line5"
          ],
        }

Context Interfaces
------------------

The context interfaces provide additional context data.  Typically this is
data related to the current user, the current HTTP request.

.. describe:: sentry.interfaces.http.Http

    Alias: ``request``

    The Request information is stored in the Http interface. Two arguments
    are required: url and ``method``.

    The ``env`` variable is a compounded dictionary of HTTP headers as
    well as environment information passed from the webserver. Sentry will
    explicitly look for ``REMOTE_ADDR`` in ``env`` for things which
    require an IP address.

    The data variable should only contain the request body (not the query
    string). It can either be a dictionary (for standard HTTP requests) or
    a raw request body.

    ``url``
        The full URL of the request if available.
    ``method``
        The actual HTTP method of the request.
    ``data``
        Submitted data in whatever format makes most sense.  This data
        should not be provided by default as it can get quite large
    ``query_string``
        The unparsed query string as it is provided.
    ``cookies``
        The cookie values.  Typically unparsed as a string.
    ``headers``
        A dictionary of submitted headers.  If a header appears multiple
        times it needs to be merged according to the HTTP standard for
        header merging.
    ``env``
        Optional environment data.  This is where information such as
        CGI/WSGI/Rack keys go that are not HTTP headers.

    .. sourcecode:: json

        {
          "url": "http://absolute.uri/foo",
          "method": "POST",
          "data": {
            "foo": "bar"
          },
          "query_string": "hello=world",
          "cookies": "foo=bar",
          "headers": {
            "Content-Type": "text/html"
          },
          "env": {
            "REMOTE_ADDR": "192.168.0.1"
          }
        }

.. describe:: sentry.interfaces.user.User

    Alias: ``user``

    An interface which describes the authenticated User for a request.

    You should provide at least either an ``id`` (a unique identifier for
    an authenticated user) or ``ip_address`` (their IP address).

    ``id``
        The unique ID of the user.
    ``email``
        The email address of the user.
    ``ip_address``
        The IP of the user.
    ``username``
        The username of the user

    All other keys are stored as extra information but not specifically
    processed by sentry.

    .. sourcecode:: json

        {
          "id": "unique_id",
          "username": "my_user",
          "email": "foo@example.com",
          "ip_address": "127.0.0.1",
          "subscription": "basic"
        }

.. describe:: sentry.interfaces.query.Query

    Alias: ``query``

    A SQL query with an optional string describing the SQL driver,
    ``engine``.

    ``query``
        The SQL query.  Not always can this be entirely provided with
        parameters, so it's perfectly okay to submit a partial query here.
    ``engine``
        Some description of what engine was used (driver name) to help
        make sense of the query as a human reader.

    .. sourcecode:: json

        {
          "query": "SELECT 1",
          "engine": "psycopg2"
        }


Breadcrumbs Interface
---------------------

**NOTE:** *Breadcrumbs are an experimental Sentry feature and may not yet be available.*

The breadcrumbs interface specifies a series of application events, or "breadcrumbs",
that occurred before the main event.

.. describe:: sentry.interfaces.Breadcrumbs

    Alias: ``breadcrumbs``

    An array of breadcrumbs. Breadcrumb entries are ordered from oldest to newest. The last breadcrumb
    in the array should be the last entry before the main event fired.

    Each breadcrumb has two required properties: ``timestamp``, and ``type``. A
    third property, ``data``, is optional and its contents depend on the breadcrumb ``type``.

    ``timestamp``
      A timestamp representing when the breadcrumb occurred. This can be either an ISO datetime string,
      or a Unix timestamp.
    ``type``
      The type of breadcrumb. Can be one of ``message``, ``http_request``, ``ui_event``, ``error``,
      or ``navigation``.
    ``data``
      Data associated with this breadcrumb. Contains a sub-object whose contents depend on the breadcrumb
      ``type``. See descriptions of breadcrumb types below.

    .. sourcecode:: json

        [{
          "timestamp": 1461185753845,
          "type": "message",
          "data": {
            "message": "Something happened",
            "level": "debug"
          }
        }, {
          "timestamp": 1461185753847,
          "type": "navigation",
          "data": {
            "from": "/login",
            "to": "/dashboard"
          }
        }]

Breadcrumb Types
~~~~~~~~~~~~~~~~

Below are descriptions of individual breadcrumb types, and what their ``data`` properties look like.

.. describe:: message

    Describes a log message breadcrumb. This is typically a generic log message.

    Its ``data`` property has the following sub-properties:

    ``message``
      The log message string.
    ``level``
      The log level (optional). This can be any string, but Sentry will recognize standard debug levels
      like ``debug``, ``info``, ``warning``, and ``error``.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "message",
          "data": {
            "message": "Something happened",
            "level": "debug"
          }
        }

.. describe:: navigation

    Describes a navigation breadcrumb. A navigation event can be a URL change in a web application, or
    a UI transition in a mobile or desktop application, etc.

    Its ``data`` property has the following sub-properties:

    ``from``
      A string representing the original application state / location.
    ``to``
      A string representing the new application state / location.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "navigation",
          "data": {
            "from": "/login",
            "to": "/dashboard"
          }
        }

.. describe:: ui_event

    Describes a UI event breadcrumb.

    Its ``data`` property has the following sub-properties:

    ``type``
      A string representing the "type" of UI event. This can be any descriptive string representing the
      UI event, like "click" or "keypress".
    ``target``
      A string representing the UI event target, if there is one. This can be any descriptive string
      representing the UI target, like HTML describing a DOM element target.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "ui_event",
          "data": {
            "type": "click",
            "target": "<input type=\"password\" name=\"password\" />"
          }
        }

.. describe:: error

    Describes an error breadcrumb. This represents a previous error event that was sent to Sentry
    from your client.

    Its ``data`` property has the following sub-properties:

    ``type``
      The type of error, e.g. "ReferenceError" or "TypeError".
    ``message``
      The full error message, e.g. "foo is not defined".
    ``event_id``
      The ID of the event sent to Sentry.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "error",
          "data": {
            "type": "ReferenceError",
            "message": "foo is not defined",
            "event_id": "765b3d6acabc4de788e0156f79b9e658"
          }
        }

.. describe:: http_request

    Describes an HTTP request breadcrumb. This represents an HTTP request transmitted from your
    application. This could be an AJAX request from a web application, or a server-to-server HTTP
    request to an API service provider, etc.

    Its ``data`` property has the following sub-properties:

    ``url``
      The request URL.
    ``method``
      The HTTP request method.
    ``status_code``
      The HTTP status code of the response.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "error",
          "data": {
            "url": "http://example.com/api/1.0/users",
            "method": "GET",
            "status_code": 200
          }
        }

.. describe:: query

    Describes a database query breadcrumb. This represents a query to a database
    from the application. Typically this is SQL.

    Its ``data`` property has the following sub-properties:

    ``query``
      The query. Typically a string but can also be a JSON object.
    ``params``
      Query parameters.  This can be a list of values for the query.  Each
      item is inserted into the query whenever a ``%s`` is encountered.
    ``duration``
      Duration of the query in seconds.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "query",
          "data": {
            "query": "SELECT * FROM users WHERE id = %s",
            "params": [42],
            "duration": 0.0001,
          }
        }
