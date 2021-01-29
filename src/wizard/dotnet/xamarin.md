---
name: Xamarin
doc_link: https://docs.sentry.io/platforms/dotnet/guides/xamarin/
support_level: alpha
type: library
---

## Install the NuGet package

```shell
# For Xamarin.Forms
Install-Package Sentry.Xamarin.Forms -Version 1.0.0

# If you are not using Xamarin.Forms, but only Xamarin:
Install-Package Sentry.Xamarin -Version 1.0.0

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
            options.Dsn = "___PUBLIC_DSN___";
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
                options.AddXamarinFormsIntegration();
            });
```

### Verifying Your Setup

You can Verify Sentry by raising an unhandled exception. For example, you can use the following snippet to raise a NullReferenceException:

```csharp
    throw null;
}
```

You might need to open the app again for the crash report to be sent to the server.

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete Xamarin Forms docs](https://docs.sentry.io/platforms/dotnet/guides/xamarin/).

## Limitations

There are no line numbers on stack traces for UWP and in release builds for Android and iOS.

### Samples

You can find an example of a Xamarin Forms app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/sentry-dotnet-xamarin/tree/main/Samples)
