---
name: Unity
doc_link: https://docs.sentry.io/platforms/unity/
support_level: production
type: framework
---

## Installation

Get the SDK via the [Unity Package Manager using a Git URL](https://docs.unity3d.com/Manual/upm-ui-giturl.html) to Sentry's SDK repository:

```
https://github.com/getsentry/sentry-unity-lite.git#1.0.3
```

## Configuration

Now you need to pass the DSN (a URL that uniquely identifies your project within Sentry) and the SDK will automatically capture errors.

You can attach Sentry to a Game Object and initialize it with the DSN programatically:

```csharp
var sentry = gameObject.AddComponent<SentrySdk>();
sentry.Dsn = "___PUBLIC_DSN___";
```

And that's it! Now Sentry can capture errors in the application automatically.

## Capture a test event

Once the SDK is configured with the DSN, you can call from anywhere:

```csharp
SentrySdk.CaptureMessage("Test event");
```
