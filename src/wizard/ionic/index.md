---
name: Capacitor
doc_link: https://docs.sentry.io/platforms/javascript/guides/capacitor/
support_level: production
type: framework
---

Install the Sentry Capacitor SDK alongside the sibling Sentry SDK:

```angular {tabTitle: Ionic + Angular}
# npm
npm install --save @sentry/capacitor @sentry/angular

# yarn
yarn add @sentry/capacitor @sentry/angular @sentry/tracing
```

```react {tabTitle: Ionic + React}
# npm
npm install --save @sentry/capacitor @sentry/react 

# yarn
yarn add @sentry/capacitor @sentry/react  @sentry/tracing
```

```vue {tabTitle: Ionic + Vue}
# npm
npm install --save @sentry/capacitor @sentry/vue 

# yarn
yarn add @sentry/capacitor @sentry/vue  @sentry/tracing
```

## Android Installation

Then, add the `SentryCapacitor` plugin class inside the `onCreate` method of your `MainActivity` file.

Java:

```java
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import io.sentry.capacitor.SentryCapacitor;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(SentryCapacitor.class);
    }});
  }
}
```

Kotlin:

```kotlin
import android.os.Bundle
import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin
import io.sentry.capacitor.SentryCapacitor

class MainActivity : BridgeActivity() {
  fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Initializes the Bridge
    this.init(
      savedInstanceState,
      listOf<Class<out Plugin>>(SentryCapacitor::class.java)
    )
  }
}
```

## Initializing the SDK

You must initialize the Sentry SDK as early as you can:

```angular {tabTitle: Angular}
// app.module.ts
import * as Sentry from "@sentry/capacitor";
import * as SentryAngular from "@sentry/angular";
// If taking advantage of automatic instrumentation (highly recommended)
import { BrowserTracing } from "@sentry/tracing";
// Or, if only manually tracing
// import "@sentry/tracing";
// Note: You MUST import the package in some way for tracing to work

Sentry.init(
  {
    dsn: "___PUBLIC_DSN___",
    // To set your release and dist versions
    release: "my-project-name@" + process.env.npm_package_version,
    dist: "1",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ["localhost", "https://yourserver.io/api"],
      }),
    ]
  },
  // Forward the init method from @sentry/angular
  SentryAngular.init
);

@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      // Attach the Sentry ErrorHandler
      useValue: SentryAngular.createErrorHandler(),
    },
  ],
})
```

```react {tabTitle: React}
import * as Sentry from "@sentry/capacitor";
import * as SentryReact from "@sentry/react";
// If taking advantage of automatic instrumentation (highly recommended)
import { BrowserTracing } from "@sentry/tracing";
// Or, if only manually tracing
// import "@sentry/tracing";
// Note: You MUST import the package in some way for tracing to work

setupIonicReact();

Sentry.init(
  {
    dsn: "___PUBLIC_DSN___",
    // To set your release and dist versions
    release: "my-project-name@" + process.env.npm_package_version,
    dist: "1",
    debug: true,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ["localhost", "https://yourserver.io/api"],
      }),
    ]
  },
  // Forward the init method from @sentry/react
  SentryReact.init
);
```

```vue {tabTitle: Vue}
import * as Sentry from "@sentry/capacitor";
import * as SentryVue from "@sentry/vue";
// If taking advantage of automatic instrumentation (highly recommended)
import { BrowserTracing } from "@sentry/tracing";
// Or, if only manually tracing
// import "@sentry/tracing";
// Note: You MUST import the package in some way for tracing to work

const app = createApp(App)
  .use(IonicVue)
  ...
  .use(router);

Sentry.init(
  {
    dsn: "___PUBLIC_DSN___",
    // To set your release and dist versions
    release: "my-project-name@" + process.env.npm_package_version,
    dist: "1",
    debug: true,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ["localhost", "https://yourserver.io/api"],
      }),
    ]
  },
  // Forward the init method from @sentry/vue
  SentryVue.init
);

router.isReady().then(() => {
  ...
});
```

## Verify

This snippet includes an intentional error, so you can test that everything is working as soon as you set it up:

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.captureException("Test Captured Exception");
```

You can also throw an error anywhere in your application:

```javascript
// Must be thrown after Sentry.init is called to be captured.
throw new Error(`Test Thrown Error`);
```

Or trigger a native crash:

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.nativeCrash();
```
