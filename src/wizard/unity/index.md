---
name: Unity
doc_link: https://docs.sentry.io/platforms/unity/
support_level: production
type: framework
---

## Installation

Install the package via the [Unity Package Manager using a Git URL](https://docs.unity3d.com/Manual/upm-ui-giturl.html) to Sentry's SDK repository:

```
https://github.com/getsentry/unity.git#{{ packages.version('sentry.dotnet.unity', '0.1.0') }}
```
Confirm the URL doesn't have a trailing whitespace at the end. The Unity Package Manager will fail to find the package if a trailing whitespace is appended.

Some Unity versions, such as `2019.4.24f1` and `2020.3.2f1`, have a bug on UPM and fail to install with the error `'HEAD': cannot update ref 'refs/heads/master'`. Unity has resolved this issue on newer releases. Learn more by checking the [Unity Issue Tracker](https://issuetracker.unity3d.com/issues/package-resolution-error-when-using-a-git-dependency-referencing-an-annotated-tag-in-its-git-url).

## Configuration

Access the Sentry configuration window by going to Unity's top menu: `Tools` > `Sentry` and enter the following DSN:

```
___PUBLIC_DSN___
```

And that's it! Now Sentry can capture errors automatically.

## Verify

Once it is configured with the DSN you can call the SDK from anywhere:

```csharp
SentrySdk.CaptureMessage("Test event");
```
