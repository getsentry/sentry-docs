Breadcrumbs Interface
=====================

The breadcrumbs interface specifies a series of application events, or "breadcrumbs",
that occurred before the main event.

.. describe:: sentry.interfaces.Breadcrumbs

    Alias: ``breadcrumbs``

    An array of breadcrumbs. Breadcrumb entries are ordered from oldest to newest. The last breadcrumb
    in the array should be the last entry before the main event fired.

    Each breadcrumb has a few properties of which at least ``timestamp``
    and ``category`` must be provided.  The rest is optional and depending on what
    is provided the rendering might be different.

    ``timestamp``
      A timestamp representing when the breadcrumb occurred. This can be either an ISO datetime string,
      or a Unix timestamp.
    ``type``
      The type of breadcrumb. The default type is ``default`` which indicates
      no specific handling.  Other types are currently ``http`` for HTTP
      requests and ``navigation`` for navigation events.  More about types
      later.
    ``message``
      If a message is provided it's rendered as text where whitespace is
      preserved.  Very long text might be abbreviated in the UI.
    ``data``
      Data associated with this breadcrumb. Contains a sub-object whose
      contents depend on the breadcrumb ``type``. See descriptions of
      breadcrumb types below.  Additional parameters that are unsupported
      by the type are rendered as a key/value table.
    ``category``
      Categories are dotted strings that indicate what the crumb is or
      where it comes from.  Typically it's a module name or a descriptive
      string.  For instance `ui.click` could be used to indicate that a
      click happend in the UI or `flask` could be used to indicate that
      the event originated in the Flask framework.
    ``level``
      This defines the level of the event.  If not provided it defaults to
      ``info`` which is the middle level.  In the order of priority from
      highest to lowest the levels are ``critical``, ``error``,
      ``warning``, ``info`` and ``debug``.  Levels are used in the UI to
      emphasize and deemphasize the crumb.

    .. sourcecode:: json

        "breadcrumbs": [
          {
            "timestamp": 1461185753845,
            "message": "Something happened",
            "category": "log",
            "data": {
              "foo": "bar",
              "blub": "blah"
            }
          }, {
            "timestamp": 1461185753847,
            "type": "navigation",
            "data": {
              "from": "/login",
              "to": "/dashboard"
            }
          }
        ]

Breadcrumb Types
~~~~~~~~~~~~~~~~

Below are descriptions of individual breadcrumb types, and what their ``data`` properties look like.

.. describe:: default

    Describes an unspecified breadcrumb. This is typically a generic log message
    or something similar.  The ``data`` part is entirely undefined and as
    such completely rendered as a key/value table.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "message": "Something happened",
          "category": "log",
          "data": {
            "key": "value"
          }
        }

.. describe:: navigation

    Describes a navigation breadcrumb. A navigation event can be a URL
    change in a web application, or a UI transition in a mobile or desktop
    application, etc.

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

.. describe:: http

    Describes an HTTP request breadcrumb. This represents an HTTP request
    transmitted from your application. This could be an AJAX request from
    a web application, or a server-to-server HTTP request to an API
    service provider, etc.

    Its ``data`` property has the following sub-properties:

    ``url``
      The request URL.
    ``method``
      The HTTP request method.
    ``status_code``
      The HTTP status code of the response.
    ``reason``
      A text that describes the status code.

    .. sourcecode:: json

        {
          "timestamp": 1461185753845,
          "type": "http",
          "data": {
            "url": "http://example.com/api/1.0/users",
            "method": "GET",
            "status_code": 200,
            "reason": "OK"
          }
        }
