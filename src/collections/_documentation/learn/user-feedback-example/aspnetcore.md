With ASP.NET Core MVC, the `Error.cshtml` razor page:

{% raw %}
```html
@using Sentry

<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>

@if (SentrySdk.LastEventId != Guid.Empty)
{
    <script>
        Sentry.init({ dsn: '___PUBLIC_DSN___' });
        Sentry.showReportDialog({ eventId: '@SentrySdk.LastEventId' });
    </script>
}
```
{% endraw %}
