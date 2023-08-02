---
name: Qt
doc_link: https://docs.sentry.io/platforms/native/guides/qt/
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

Install the SDK by downloading the [latest release](https://github.com/getsentry/sentry-native/releases). Next, follow the
instructions in the [_Native SDK Documentation_](/platforms/native/guides/qt/) to build the SDK library.

Import and initialize the Sentry SDK early in your application setup:

```cpp
#include <QtWidgets>
#include <sentry.h>

int main(int argc, char *argv[])
{
    sentry_options_t *options = sentry_options_new();
    sentry_options_set_dsn(options, "___PUBLIC_DSN___");
    // This is also the default-path. For further information and recommendations:
    // https://docs.sentry.io/platforms/native/configuration/options/#database-path
    sentry_options_set_database_path(options, ".sentry-native");
    sentry_options_set_release(options, "my-project-name@2.3.12");
    sentry_options_set_debug(options, 1);
    sentry_init(options);

    // Make sure everything flushes
    auto sentryClose = qScopeGuard([] { sentry_close(); });

    QApplication app(argc, argv);
    /* ... */
    return app.exec();
}
```

Alternatively, the DSN can be passed as `SENTRY_DSN` environment variable during
runtime. This can be especially useful for server applications.

The quickest way to verify Sentry in your Qt application is by capturing a message:

```c
sentry_capture_event(sentry_value_new_message_event(
  /*   level */ SENTRY_LEVEL_INFO,
  /*  logger */ "custom",
  /* message */ "It works!"
));
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
