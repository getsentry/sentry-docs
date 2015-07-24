Context Management
==================

All clients should have the concept of a concurrency safe context storage.
What this means heavily depends on the language.  The basic idea is that a
user of the Raven library can call a method to provide additional context
information from whererever the user has access to the client object in a
safe way.

In general this is implemented as a thread local in most languages, but in
some (like JavaScript) it can be global under the assumption that this is
something that makes sense in the environment.

User's Perspective
------------------

From the user's perspective of the raven client there should be two types
of APIs:

``RavenClient.context``:
    Given a raven client object it should be possible to get a reference
    to the underlying context object for manual updating.  This might not
    always be something that makes sense in the context of the language,
    so it's possible to hide this.

    If it is possible in the language, then it's encouraged that this is a
    thread local accessor to not break concurrent environments.  For
    instance the Python client has a different context for each thread to
    support concurrent web frameworks and multithreaded environments.

    If the context is exposed it needs to provide two methods:

    *   ``merge()``: to merge in a new nested dictionary of data over
        the existing data.
    *   ``clear()``: to clear the context entirely.  This is necessary so
        that reuse of threads is safe and old data does not leak into the
        reused context.

``RavenClient.*_context``:
    These are methods that update the context according to the name of the
    method.  Which of those methods exist is up to the client developer,
    however as a general rule those should exist:

    *   ``user_context``
    *   ``tags_context``
    *   ``http_context``
    *   ``extra_context``

Ideally a user never needs to be concerned with clearing the context.
Framework integrations should do this automatically as far as possible.
For instance if a client integration is configured for a web framework
it should automatically hook the framework in a way where it will clear
the context at the end of every request and ideally also already invoke
things like ``http_context`` automatically.

Context Clearing
----------------

For most clients there should be a method to clear the context.  This is
especially imporant in multithreaded environments where threads might be
re-used.  The preferred method to clear the context would be automatically
if that is something the client can provide.  As mentioned earlier the
framework integrations in the clients should do this whenever possible.

For manual clearing ``client.context.clear()`` is the preferred method.
If the context cannot be directly exposed, ``client.clearContext()`` or a
method with a similar name should exist.
