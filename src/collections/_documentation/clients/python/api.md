---
title: 'API Reference'
robots: noindex
---

This gives you an overview of the public API that raven-python exposes.

## Client

{: #raven.Client}_class_ `raven.``Client`(_dsn=None_, _**kwargs_)

: The client needs to be instanciated once and can then be used for submitting events to the Sentry server. For information about the configuration of that client and which parameters are accepted see [Configuring the Client](/clients/python/advanced/#python-client-config).

  {: #raven.Client.capture}`capture`(_event_type_, _data=None_, _date=None_, _time_spent=None_, _extra=None_, _stack=False_, _tags=None_, _**kwargs_)

  : This method is the low-level method for reporting events to Sentry. It captures and processes an event and pipes it via the configured transport to Sentry.

    Example:

    ```python
    capture('raven.events.Message', message='foo', data={
        'request': {
            'url': '...',
            'data': {},
            'query_string': '...',
            'method': 'POST',
        },
        'logger': 'logger.name',
    }, extra={
        'key': 'value',
    })
    ```

    <table class="table"><tbody valign="top"><tr><th>Parameters:</th><td><ul><li><strong>event_type</strong> – the module path to the Event class. Builtins can use shorthand class notation and exclude the full module path.</li><li><strong>data</strong> – the data base, useful for specifying structured data interfaces. Any key which contains a ‘.’ will be assumed to be a data interface.</li><li><strong>date</strong> – the datetime of this event. If not supplied the current timestamp is used.</li><li><strong>time_spent</strong> – a integer value representing the duration of the event (in milliseconds)</li><li><strong>extra</strong> – a dictionary of additional standard metadata.</li><li><strong>stack</strong> – If set to <cite>True</cite> a stack frame is recorded together with the event.</li><li><strong>tags</strong> – dict of extra tags</li><li><strong>sample_rate</strong> – a float in the range [0, 1] to sample this message. This overrides the Client object’s sample_rate</li><li><strong>kwargs</strong> – extra keyword arguments are handled specific to the reported event type.</li></ul></td></tr><tr><th>Returns:</th><td>a tuple with a 32-length string identifying this event</td></tr></tbody></table>

  {: #raven.Client.captureMessage}`captureMessage`(_message_, _**kwargs_)

  : This is a shorthand to reporting a message via [`capture()`](#raven.Client.capture "raven.Client.capture"). It passes `'raven.events.Message'` as _event_type_ and the message along. All other keyword arguments are regularly forwarded.

    Example:

    ```python
    client.captureMessage('This just happened!')
    ```

  {: #raven.Client.captureException}`captureException`(_exc_info=None_, _**kwargs_)

  : This is a shorthand to reporting an exception via [`capture()`](#raven.Client.capture "raven.Client.capture"). It passes `'raven.events.Exception'` as _event_type_ and the traceback along. All other keyword arguments are regularly forwarded.

    If exc_info is not provided, or is set to True, then this method will perform the `exc_info = sys.exc_info()` and the requisite clean-up for you.

    Example:

    ```python
    try:
        1 / 0
    except Exception:
        client.captureException()
    ```

  `captureBreadcrumb(message=None, timestamp=None,`
  `level=None, category=None, data=None,`
  `type=None, processor=None)`

  : Manually captures a breadcrumb in the internal buffer for the current client’s context. Instead of using this method you are encouraged to instead use the [`raven.breadcrumbs.record()`](/clients/python/breadcrumbs/#raven.breadcrumbs.record "raven.breadcrumbs.record") function which records to the correct client automatically.

  {: #raven.Client.send}`send`(_**data_)

  : Accepts all data parameters and serializes them, then sends then onwards via the transport to Sentry. This can be used as to send low-level protocol data to the server.

  {: #raven.Client.context}`context`

  : Returns a reference to the thread local context object. See [`raven.context.Context`](#raven.context.Context "raven.context.Context") for more information.

  {: #raven.Client.user_context}`user_context`(_data_)

  : Updates the user context for future events.

    Equivalent to this:

    ```python
    client.context.merge({'user': data})
    ```

  {: #raven.Client.http_context}`http_context`(_data_)

  : Updates the HTTP context for future events.

    Equivalent to this:

    ```python
    client.context.merge({'request': data})
    ```

  {: #raven.Client.extra_context}`extra_context`(_data_)

  : Update the extra context for future events.

    Equivalent to this:

    ```python
    client.context.merge({'extra': data})
    ```

  {: #raven.Client.tags_context}`tags_context`(_data_)

  : Update the tags context for future events.

    Equivalent to this:

    ```python
    client.context.merge({'tags': data})
    ```

## Context

{: #raven.context.Context}_class_ `raven.context.``Context`

: The context object works similar to a dictionary and is used to record information that should be submitted with events automatically. It is available through [`raven.Client.context`](#raven.Client.context "raven.Client.context") and is thread local. This means that you can modify this object over time to feed it with more appropriate information.

  {: #raven.context.Context.activate}`activate`()

  : Binds the context to the current thread. This normally happens automatically on first usage but if the context was deactivated then this needs to be called again to bind it again. Only if a context is bound to the thread breadcrumbs will be recorded.

  {: #raven.context.Context.deactivate}`deactivate`()

  : This deactivates the thread binding of the context. In particular it means that breadcrumbs of the current thread are no longer recorded to this context.

  {: #raven.context.Context.merge}`merge`(_data_, _activate=True_)

  : Performs a merge of the current data in the context and the new data provided. This also automatically activates the context by default.

  {: #raven.context.Context.clear}`clear`(_deactivate=None_)

  : Clears the context. It’s important that you make sure to call this when you reuse the thread for something else. For instance for web frameworks it’s generally a good idea to call this at the end of the HTTP request.

    Otherwise you run at risk of seeing incorrect information after the first use of the thread.

    Optionally _deactivate_ parameter controls if the context should automatically be deactivated. The default behavior is to deactivate if the context was not created for the main thread.

  The context can also be used as a context manager. In that case [`activate()`](#raven.context.Context.activate "raven.context.Context.activate") is called on enter and [`deactivate()`](#raven.context.Context.deactivate "raven.context.Context.deactivate") is called on exit.
