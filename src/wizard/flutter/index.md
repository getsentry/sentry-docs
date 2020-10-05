---
name: Flutter
doc_link: https://docs.sentry.io/platforms/flutter/
support_level: production
type: framework
---

Get the SDK from from [pub.dev](https://pub.dev/packages/sentry) by adding the following to your `pubspec.yaml`:

```yml
dependencies:
  sentry: ">=3.0.0 <4.0.0"
```

Import `SentryClient` and initialize it:

```dart
import 'package:sentry/sentry.dart';

final sentry = SentryClient(dsn: "___PUBLIC_DSN___");
```

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

```dart
// Throw an exception and capture it with the Sentry client:
try {
  throw null;
} catch (error, stackTrace) {
  await sentry.captureException(
    exception: error,
    stackTrace: stackTrace,
  );
}
```

### Resources

Flutter has extensive documentation, which includes a
[cookbook on how to integrate with Sentry](https://flutter.dev/docs/cookbook/maintenance/error-reporting).

### Source code

The Sentry SDK is part of the [Flutter organization on GitHub](https://github.com/flutter/sentry).
Sentry is working on improving the Flutter integration on top of the core Dart SDK
through [`sentry-flutter`](https://github.com/getsentry/sentry-flutter/).
