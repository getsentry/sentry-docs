One way to verify your setup is by intentionally sending an event that breaks your application. 

You can throw an exception in your PHP application:

```php
throw new Exception("My first Sentry error!");
```
