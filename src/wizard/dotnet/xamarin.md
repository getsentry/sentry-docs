---
name: Xamarin
doc_link: https://docs.sentry.io/platforms/dotnet/guides/xamarin/
support_level: production
type: framework
---

## Install the NuGet package

```shell
# For Xamarin.Forms
Install-Package Sentry.Xamarin.Forms -Version {{@inject packages.version('sentry.dotnet.xamarin') }}

# If you are not using Xamarin.Forms, but only Xamarin:
Install-Package Sentry.Xamarin -Version {{@inject packages.version('sentry.dotnet.xamarin-forms') }}

```

## Initialize the SDK

Initialize the SDK as early as possible, like in the constructor of the `App`, and Add `SentryXamarinFormsIntegration` as a new Integration to `SentryXamarinOptions` if you are going to run your app with Xamarin Forms:

### Android

Initialize the SDK on your `MainActivity`.

```csharp
public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
{
    protected override void OnCreate(Bundle savedInstanceState)
    {
        SentryXamarin.Init(options =>
        {
            // Tells which project in Sentry to send events to:
            options.Dsn = "___PUBLIC_DSN___";
            // When configuring for the first time, to see what the SDK is doing:
            options.Debug = true;
            // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.TracesSampleRate = 1.0;
            // If you installed Sentry.Xamarin.Forms:
            options.AddXamarinFormsIntegration();
        });
```

### iOS

Initialize the SDK on your `AppDelegate.cs`

```csharp
public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
{
    public override bool FinishedLaunching(UIApplication app, NSDictionary options)
    {
        SentryXamarin.Init(options =>
        {
            options.Dsn = "___PUBLIC_DSN___";
            // When configuring for the first time, to see what the SDK is doing:
            options.Debug = true;
            // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.TracesSampleRate = 1.0;
            options.AddXamarinFormsIntegration();
        });
```

### UWP

Initialize the SDK on `App.xaml.cs`.

NOTE: It's recommended to not setup the CacheDirectory for UWP.

```csharp
sealed partial class App : Application
{
    protected override void OnLaunched(LaunchActivatedEventArgs e)
    {
        SentryXamarin.Init(options =>
        {
            options.Dsn = "___PUBLIC_DSN___";
            // When configuring for the first time, to see what the SDK is doing:
            options.Debug = true;
            // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.TracesSampleRate = 1.0;
            options.AddXamarinFormsIntegration();
        });
```

## Verify

To verify your set up, you can capture a message with the SDK:

```csharp
SentrySdk.CaptureMessage("Hello Sentry");
```

You might need to open the app again for the crash report to be sent to the server.

### Performance Monitoring

You can measure the performance of your code by capturing transactions and spans.

```csharp
// Transaction can be started by providing, at minimum, the name and the operation
var transaction = SentrySdk.StartTransaction(
  "test-transaction-name",
  "test-transaction-operation"
);

// Transactions can have child spans (and those spans can have child spans as well)
var span = transaction.StartChild("test-child-operation");

// ...
// (Perform the operation represented by the span/transaction)
// ...

span.Finish(); // Mark the span as finished
transaction.Finish(); // Mark the transaction as finished and send it to Sentry
```

Check out [the documentation](https://docs.sentry.io/platforms/dotnet/performance/instrumentation/) to learn more about the API and automatic instrumentations.

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete Xamarin Forms docs](https://docs.sentry.io/platforms/dotnet/guides/xamarin/).

## Limitations

There are no line numbers on stack traces for UWP and in release builds for Android and iOS.

### Samples

You can find an example of a Xamarin Forms app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/sentry-xamarin/tree/main/Samples)
