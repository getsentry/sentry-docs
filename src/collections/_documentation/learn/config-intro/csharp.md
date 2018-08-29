Options can be set by passing a callback to the `Init()` function which will
pass the option object along for modifications:

```javascript
using Sentry;

using (SentrySdk.Init(o =>
{
    o.Dsn = "___PUBLIC_DSN___";
    o.MaxBreadcrumbs = 50;
    o.Debug = true;
})
{
    // app code here
}
```
