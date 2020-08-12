```python
class DatabaseConnectionError(Exception):
    pass

def before_send(event, hint):
    if 'exc_info' not in hint:
        return event

    exception = hint['exc_info'][1]
    if isinstance(exception, DatabaseConnectionError):
        event['fingerprint'] = ['database-connection-error']

    return event

sentry_sdk.init(..., before_send=before_send)
```
