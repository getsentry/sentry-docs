---
name: Flutter
doc_link: https://docs.sentry.io/platforms/flutter/
support_level: production
type: framework
---

Get the SDK from [pub.dev](https://pub.dev/packages/sentry_flutter) by adding the following to your `pubspec.yaml`:

```yml {filename:pubspec.yaml}
dependencies:
  sentry_flutter: ^4.0.1
```

Import `sentry_flutter` and initialize it:

```dart
import 'package:flutter/widgets.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

Future<void> main() async {
  await SentryFlutter.init(
    (options) {
      options.dsn = '___PUBLIC_DSN___';
    },
    appRunner: () => runApp(MyApp()),
  );
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
