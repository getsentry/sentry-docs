---
name: Flutter
doc_link: https://docs.sentry.io/platforms/flutter/
support_level: production
type: framework
---

Sentry captures data by using an SDK within your application’s runtime. Add the following to your `pubspec.yaml`:

```yml {filename:pubspec.yaml}
dependencies:
  sentry_flutter: ^4.0.4
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

  // or define SENTRY_DSN via Dart environment variable (--dart-define)
}  
```

Then create an intentional error, so you can test that everything is working:

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

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
