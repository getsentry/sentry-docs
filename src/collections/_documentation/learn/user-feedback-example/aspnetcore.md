With ASP.NET Core MVC, the `Error.cshtml` razor page:

{% raw %}
```html
@using Sentry

<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>

@if (SentrySdk.LastEventId != Guid.Empty)
{
    <script>
        Sentry.showReportDialog({
            eventId: '@SentrySdk.LastEventId'
        });
    </script>
}
```
{% endraw %}
