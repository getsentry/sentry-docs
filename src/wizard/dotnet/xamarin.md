---
name: Xamarin
doc_link: https://docs.sentry.io/platforms/dotnet/guides/xamarin/
support_level: alpha
type: library
---

## Install the NuGet package

```shell
# Using Package Manager
Install-Package Sentry.Xamarin.Forms -Version 1.0.0-alpha.3
```

## Initialize the SDK

Initialize the SDK as early as possible, like in the constructor of the `App`, and Add `SentryXamarinFormsIntegration` as a new Integration to `SentryOptions`:


### Android
Initialize the SDK on your `MainActivity`.

```csharp
public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
{
    protected override void OnCreate(Bundle savedInstanceState)
    {
		SentryXamarin.Init(options =>
		{
			options.Dsn = "__YOUR__DSN__";
		});
        ...
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
			options.Dsn = "__YOUR__DSN__";
		});
        ...
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
				options.Dsn = "__YOUR__DSN__";
			});
			...   
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete Xamarin Forms docs](https://docs.sentry.io/platforms/dotnet/guides/xamarin/).

## Limitations

There are no line numbers on stack traces for UWP and in release builds for Android and iOS.

### Samples

You can find an example of a Xamarin Forms app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/sentry-dotnet-xamarin/tree/main/Samples)
