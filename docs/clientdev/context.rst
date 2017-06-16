.. _context:

Context Management
==================

All SDKs should have the concept of concurrency safe context storage.
What this means depends on the language.  The basic idea is that a
user of the SDK can call a method to safely provide additional
context information from whererever the user has access to the client object.

This is implemented as a thread local in most languages, but in some
(such as JavaScript) it might be global under the assumption that this is
something that makes sense in the environment.

User's Perspective
------------------

From the user's perspective of the Sentry SDK there should be two types
of APIs:

``SentryClient.context``:
    Given a Sentry SDK object it should be possible to get a reference
    to the underlying context object for manual updating.  This might not
    always be something that makes sense in the context of the language,
    so it's sometimes reasonable to hide this.

    If it is possible in the language, then it's encouraged that this be a
    thread local accessor so as not to break concurrent environments.  For
    instance the Python SDK has a different context for each thread to
    support concurrent web frameworks and multithreaded environments.

    If the context is exposed it needs to provide two methods:

    *   ``merge()``: to merge in a new nested dictionary of data over
        the existing data.
    *   ``clear()``: to clear the context entirely.  This is necessary so
        that reuse of threads is safe and old data does not leak into the
        reused context.

``SentryClient.*_context``:
    These are methods that update the context according to the name of the
    method.  Which of those methods exist is up to the SDK developer,
    however as a general rule these should exist:

    *   ``user_context``
    *   ``tags_context``
    *   ``http_context``
    *   ``extra_context``

Ideally a user never needs to be concerned with clearing the context.
Framework integrations should do this automatically as far as possible.
For instance if a SDK integration is configured for a web framework
it should automatically hook the framework in a way where it will clear
the context at the end of every request and ideally also already invoke
things like ``http_context`` automatically.

Context Clearing
----------------

For most SDKs there should be a method to clear the context.  This is
especially imporant in multithreaded environments where threads might be
re-used.  It is preferred that the context be cleared automatically
if that is something the SDK can provide.  As mentioned earlier the
framework integrations in the SDKs should do this whenever possible.

For manual clearing ``client.context.clear()`` is the preferred method.
If the context cannot be directly exposed, ``client.clearContext()`` or a
method with a similar name should exist.

Common Context Methods
----------------------

It is recommended that the following methods exist:

``client.user_context(data)``:
    Updates the user context for future events.

    Equivalent to this::

        client.context.merge({'user': data})

``client.http_context(data)``:
    Updates the HTTP context for future events.

    Equivalent to this::

        client.context.merge({'request': data})

``client.extra_context(data)``:
    Update the extra context for future events.

    Equivalent to this::

        client.context.merge({'extra': data})

``client.tags_context(data)``:
    Update the tags context for future events.

    Equivalent to this::

        client.context.merge({'tags': data})

For some SDKs it also makes sense to provide additional helpers to
bind the HTTP context and similar things to common language patterns. For
instance if you expect a CGI/WSGI/Rack environment you could provide
``client.cgi_context`` / ``client.wsgi_context`` methods.
