---
name: Dart
doc_link: https://docs.sentry.io/platforms/dart/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

Sentry captures data by using an SDK within your application’s runtime. Add the following to your `pubspec.yaml`:

```yml {filename:pubspec.yaml}
dependencies:
  sentry: ^{{@inject packages.version('sentry.dart') }}
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

Check out [the documentation](https://docs.sentry.io/platforms/dart/performance/instrumentation/) to learn more about the API and automatic instrumentations.
