```python
class MyRPCError(Exception):
    # The name of the RPC function that was called (e.g. "getAllBlogArticles")
    function = None

    # For example a HTTP status code returned by the server.
    error_code = None

def before_send(event, hint):
    if 'exc_info' not in hint:
        return event

    exception = hint['exc_info'][1]
    if isinstance(exception, MyRPCError):
        event['fingerprint'] = [
            '{% raw %}{{ default }}{% endraw %}',
            str(exception.function),
            str(exception.error_code)
        ]

    return event

sentry_sdk.init(..., before_send=before_send)
```
