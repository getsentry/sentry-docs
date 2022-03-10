---
name: Dart
doc_link: https://docs.sentry.io/platforms/dart/
support_level: production
type: framework
---

Sentry captures data by using an SDK within your application’s runtime. Add the following to your `pubspec.yaml`:

```yml {filename:pubspec.yaml}
dependencies:
  sentry: ^{{ packages.version('sentry.dart') }}
```

Import `sentry` and initialize it:

```dart
import 'package:sentry/sentry.dart';

Future<void> main() async {
  await Sentry.init((options) {
      options.dsn = '___PUBLIC_DSN___';
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      options.tracesSampleRate = 1.0;
    });
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
