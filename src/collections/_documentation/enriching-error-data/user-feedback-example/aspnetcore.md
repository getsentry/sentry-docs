With ASP.NET Core MVC, the `Error.cshtml` razor page:


```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>

@using Sentry
@inject IOptions<SentryAspNetCoreOptions> SentryOptions

@if (SentrySdk.LastEventId != Guid.Empty)
{
    <script>
        Sentry.init({ dsn: '@(SentryOptions.Value.Dsn)' });
        Sentry.showReportDialog({ eventId: '@SentrySdk.LastEventId' });
    </script>
}
```
