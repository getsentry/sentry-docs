---
title: Contextvars vs thread locals
sidebar_order: 11
---

The Python SDK generally does its best to figure out how contextual data such
as tags set with `sentry_sdk.set_tags` is supposed to flow along your control
flow. In most usecases this is achieved perfectly fine using [thread
locals](https://docs.python.org/3/library/threading.html#thread-local-data),
but there are quite a few situations where this approach fails.

Read this document if you cannot figure out why context data is leaking across
your HTTP requests, or when data is missing or popping up at the wrong place
and time.

## Python 2: thread locals and gevent

If the SDK is installed on Python 2, there is not much else to use than the
aforementioned thread locals, so the SDK will use just that.

Code that uses async libraries such as **`twisted` is not supported** in the
sense that you will experience context data leaking across tasks/any logical
boundaries, at least out of the box.

Code that uses more "magical" async libraries such as **`gevent` or `eventlet`
will work just fine** provided those libraries are configured to monkeypatch
the stdlib. If you are only using those libraries in the context of running
`gunicorn` that is the case, for example.

## Python 3: Contextvars or thread locals

Python 3 introduced `asyncio`, which, just like Twisted, had the problem of not
having any concept of attaching contextual data to your control flow. That
means in Python 3.6 and lower, the SDK is not able to prevent leaks of
contextual data.

Python 3.7 rectified this problem with the `contextvars` stdlib module which is
basically thread locals that also work in asyncio-based code. The SDK will
attempt to use that module instead of thread locals if available.

**For Python 3.6 and older, install `aiocontextvars` from PyPI** which is a
fully-functional backport of `contextvars`. The SDK will check for this package
and use it instead of thread locals.

## Contextvars vs gevent/eventlet

If you are using `gevent` (older than 20.5) or `eventlet` in your application and
have configured it to monkeypatch the stdlib, the SDK will abstain from using
`contextvars` even if it is available.

The reason for that is that both of those libraries will monkeypatch the
`threading` module only, and not the `contextvars` module.

The real-world usecase where this actually comes up is if you're using Django
3.0 within a `gunicorn+gevent` worker on Python 3.7. In such a scenario the
monkeypatched `threading` module will honor the control flow of a gunicorn
worker while the unpatched `contextvars` will not.

It gets more complicated if you're using Django Channels in the same app, but a
separate server process, as this is a legitimate usage of `asyncio` for which
`contextvars` behaves more correctly. Make sure that your channels websocket
server does not import or use gevent at all (and much less call
`gevent.monkey.patch_all`), and you should be good.

Even then there are still edge cases where this behavior is flat-out broken,
such as mixing asyncio code with gevent/eventlet-based code. In that case there
is no right, *static* answer as to which context library to use. Even then
gevent's aggressive monkeypatching is likely to interfere in a way that cannot
be fixed from within the SDK.

This [issue has been fixed with gevent
20.5](https://github.com/gevent/gevent/issues/1407) but continues to be one for
eventlet.
