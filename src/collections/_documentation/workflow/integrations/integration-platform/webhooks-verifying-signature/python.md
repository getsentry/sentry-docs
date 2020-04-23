```python
    body = json.dumps(request.body)
    expected = hmac.new(
        key=client_secret.encode('utf-8'),
        msg=body,
        digestmod=sha256,
    ).hexdigest()

    if expected != request.headers['Sentry-Hook-Signature']:
            raise UnauthorizedError
```
