---
title: Flutter
---

The [Flutter project maintains an SDK for Sentry](https://github.com/flutter/sentry).

Flutter has extensive documentation, which includes a
[cookbook on how to integrate with Sentry](https://flutter.dev/docs/cookbook/maintenance/error-reporting).

You can get the SDK from [pub.dev](https://pub.dev/packages/sentry):

```yml
dependencies:
  sentry: ">=3.0.0 <4.0.0"
```

Import `SentryClient` and capture events:

```dart
import 'package:sentry/sentry.dart';

final SentryClient sentry = new SentryClient(dsn: "__PUBLIC_KEY__");
```

Capture a test exception:

```dart
main() async {
  try {
    throw null;
  } catch(error, stackTrace) {
    await sentry.captureException(
      exception: error,
      stackTrace: stackTrace,
    );
  }
}

```

For more details, please refer to the [official Flutter documentation](https://flutter.dev/docs/cookbook/maintenance/error-reporting).
