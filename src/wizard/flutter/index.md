---
name: Flutter
doc_link: https://docs.sentry.io/platforms/flutter/
support_level: production
type: framework
---

Sentry captures data by using an SDK within your application’s runtime. Add the following to your `pubspec.yaml`:

```yml {filename:pubspec.yaml}
dependencies:
  sentry_flutter: ^{{@inject packages.version('sentry.dart.flutter') }}
```

Import `sentry_flutter` and initialize it:

```dart
import 'package:flutter/widgets.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

Future<void> main() async {
  await SentryFlutter.init(
    (options) {
      options.dsn = '___PUBLIC_DSN___';
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      options.tracesSampleRate = 1.0;
    },
    appRunner: () => runApp(MyApp()),
  );

  // or define SENTRY_DSN via Dart environment variable (--dart-define)
}
```

You can configure the `SENTRY_DSN`, `SENTRY_RELEASE`, `SENTRY_DIST`, and `SENTRY_ENVIRONMENT` via the Dart environment variables passing the `--dart-define` flag to the compiler, as noted in the code sample.

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

## Performance

You'll be able to monitor the performance of your app using the SDK.
For example:

```dart
import 'package:sentry/sentry.dart';

final transaction = Sentry.startTransaction('processOrderBatch()', 'task');

try {
  await processOrderBatch(transaction);
} catch (exception) {
  transaction.throwable = exception;
  transaction.status = SpanStatus.internalError();
} finally {
  await transaction.finish();
}

Future<void> processOrderBatch(ISentrySpan span) async {
  // span operation: task, span description: operation
  final innerSpan = span.startChild('task', description: 'operation');

  try {
    // omitted code
  } catch (exception) {
    innerSpan.throwable = exception;
    innerSpan.status = SpanStatus.notFound();
  } finally {
    await innerSpan.finish();
  }
}
```

Check out [the documentation](https://docs.sentry.io/platforms/flutter/performance/instrumentation/) to learn more about the API and automatic instrumentations.

## Uploads Debug Symbols

Use the Sentry Dart Plugin to upload debug symbols for Android, iOS/macOS and source maps for Web to Sentry via [sentry-cli](https://docs.sentry.io/product/cli/).

### Install

In your `pubspec.yaml`, add `sentry_dart_plugin` as a new dev dependency.

```yaml
dev_dependencies:
  sentry_dart_plugin: ^1.0.0
```
