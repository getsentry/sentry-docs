For Laravel 5 up to 5.4 you need to open up ``App/Exceptions/Handler.php`` and extend the
`render` method to make sure the 500 error is rendered as a view correctly, in 5.5+ this
step is not required anymore and you can skip ahead to the next one:

```php
<?php

use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    public function report(Exception $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            app('sentry')->captureException($exception);
        }

        parent::report($exception);
    }

    public function render($request, Exception $exception)
    {
        // Convert all non-http exceptions to a proper 500 http exception
        // if we don't do this exceptions are shown as a default template
        // instead of our own view in resources/views/errors/500.blade.php
        if ($this->shouldReport($exception) && !$this->isHttpException($exception) && !config('app.debug')) {
            $exception = new HttpException(500, 'Whoops!');
        }

        return parent::render($request, $exception);
    }
}
```

Next, create ``resources/views/errors/500.blade.php``, and embed the feedback code:

```html
<div class="content">
    <div class="title">Something went wrong.</div>

    @if(app()->bound('sentry') && app('sentry')->getLastEventId())
        <div class="subtitle">Error ID: {{ app('sentry')->getLastEventId() }}</div>
        <script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>
        <script>
            Sentry.init({ dsn: '___PUBLIC_DSN___' });
            Sentry.showReportDialog({ eventId: '{{ app('sentry')->getLastEventId() }}' });
        </script>
    @endif
</div>
```
