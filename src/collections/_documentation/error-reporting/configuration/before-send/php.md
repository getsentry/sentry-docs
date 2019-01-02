In PHP a function can be used to modify the event or return a completely new one. If you return `null`, the event will be discarded.

```php
use Sentry\Event;
use function Sentry\init;

init([
  'dsn' => '___PUBLIC_DSN___',
  'before_send' => function (Event $event): ?Event {
    return $event;
  },
]);
```
