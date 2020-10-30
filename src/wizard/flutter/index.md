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
import 'package:flutter/widgets.dart';
import 'package:sentry/sentry.dart';

// Wrap your 'runApp(MyApp())' as follows:

void main() {
  runZonedGuarded(() {
    runApp(MyApp());
  }, (exception, stackTrace) async {
    await Sentry.captureException(
      exception,
      stackTrace: stackTrace,
    );
  });
}
```

Catch Flutter specific errors by subscribing to `FlutterError.onError`:

```dart
import 'package:flutter/foundation.dart';
import 'package:sentry/sentry.dart';

void main() {
  FlutterError.onError = (FlutterErrorDetails details) async {
    await Sentry.captureException(
      details.exception,
      stackTrace: details.stack,
    );
  };
}
```

Capture a test exception:

<PlatformContent includePath="getting-started-verify" />

### Resources

Flutter has extensive documentation, which includes a
[cookbook on how to integrate with Sentry version earlier than 4.0.0](https://flutter.dev/docs/cookbook/maintenance/error-reporting).

### Source code

The Sentry Dart/Flutter SDK can be found on GitHub [`sentry-dart`](https://github.com/getsentry/sentry-dart/).
