---
name: Xamarin
doc_link: https://docs.sentry.io/platforms/dotnet/guides/xamarin/
support_level: alpha
type: library
---

## Install the NuGet package

```shell
# Using Package Manager
Install-Package Sentry.Xamarin.Forms -Version 1.0.0-alpha.2

# Or using .NET Core CLI
dotnet add package Sentry.Xamarin.Forms -v 1.0.0-alpha.2
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

## Initialize the SDK

Initialize the SDK as early as possible, like in the constructor of the `App`, and Add `SentryXamarinFormsIntegration` as a new Integration to `SentryOptions`:


### Android
Initialize the SDK on your MainActivity.

```csharp
public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
{
    protected override void OnCreate(Bundle savedInstanceState)
    {
        SentrySdk.Init(o =>
        {
			// Add the following line:
            o.Dsn = "___PUBLIC_DSN___";
            o.CacheDirectoryPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            o.AddIntegration(new SentryXamarinFormsIntegration());
        });
        ...
```

### iOS
Initialize the SDK on your AppDelegate.cs

```csharp
public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
{
    public override bool FinishedLaunching(UIApplication app, NSDictionary options)
    {
        SentrySdk.Init(o =>
        {
			// Add the following line:
            o.Dsn = "___PUBLIC_DSN___";
            o.CacheDirectoryPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            o.AddIntegration(new SentryXamarinFormsIntegration());
        });
        ...
```

### UWP
Initialize the SDK on App.xaml.cs.

NOTE: It's recommended to not setup the CacheDirectory for UWP.

```csharp
    sealed partial class App : Application
    {
        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
        SentrySdk.Init(o =>
        {
			// Add the following line:
            o.Dsn = "___PUBLIC_DSN___";
            o.AddIntegration(new SentryXamarinFormsIntegration());
        });
        ...   
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete Xamarin Forms docs](https://docs.sentry.io/platforms/dotnet/guides/xamarin/).

## Compatibility

The package requires the following versions or newer:

* Tizen 4.0 (for Tizen)
* Xamarin.Android 9.0 (for Android)
* Xamarin.iOS 10.14 (for iOS)
* Universal Windows Platform 10.0.16299 (for UWP)
* Xamarin.Forms 4.6.0.726
* Xamarin.Essentials 1.4.0
* Sentry 3.0.0

## Limitations

There are no line numbers on stack traces for UWP and in release builds for Android and iOS, furthermore, mono symbolication is not yet supported.

### Samples

You can find an example of a Xamarin Forms app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/sentry-dotnet-xamarin/tree/main/Samples)
