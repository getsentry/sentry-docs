---
name: Dart
doc_link: https://docs.sentry.io/platforms/dart/
support_level: production
type: framework
---

Get the SDK from [pub.dev](https://pub.dev/packages/sentry) by adding the following to your `pubspec.yaml`:

```yml {filename:pubspec.yaml}
dependencies:
  sentry: ^4.0.0
```

Import `sentry` and initialize it:

```dart
import 'package:sentry/sentry.dart';

Future<void> main() async {
  await Sentry.init((options) => options.dsn = '___PUBLIC_DSN___');
}
```

Capture a test exception:

```dart
import 'package:sentry/sentry.dart';

try {
  aMethodThatMightFail();
} catch (exception, stackTrace) {
  await Sentry.captureException(
    exception,
    stackTrace: stackTrace,
  );
}
```
