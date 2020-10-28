---
name: Flutter
doc_link: https://docs.sentry.io/platforms/flutter/
support_level: production
type: framework
---

Get the SDK from from [pub.dev](https://pub.dev/packages/sentry) by adding the following to your `pubspec.yaml`:

<PlatformContent includePath="getting-started-install" />

Import `Sentry` and initialize it:

<PlatformContent includePath="getting-started-config" />

Run the whole app in a zone to capture all uncaught errors:

```dart
import 'dart:async';

// Wrap your 'runApp(MyApp())' as follows:

void main() async {
  runZonedGuarded(
    () => runApp(MyApp()),
    (error, stackTrace) {
      await sentry.captureException(
        exception: error,
        stackTrace: stackTrace,
      );
    },
  );
}
```

Catch Flutter specific errors by subscribing to `FlutterError.onError`:

```dart
FlutterError.onError = (details, {bool forceReport = false}) {
  sentry.captureException(
    exception: details.exception,
    stackTrace: details.stack,
  );
};
```

Capture a test exception:

<PlatformContent includePath="getting-started-verify" />

### Resources

Flutter has extensive documentation, which includes a
[cookbook on how to integrate with Sentry](https://flutter.dev/docs/cookbook/maintenance/error-reporting).

### Source code

The Sentry SDK is part of the [Flutter organization on GitHub](https://github.com/flutter/sentry).
Sentry is working on improving the Flutter integration on top of the core Dart SDK
through [`sentry-flutter`](https://github.com/getsentry/sentry-flutter/).
