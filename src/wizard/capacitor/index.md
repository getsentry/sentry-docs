---
name: Capacitor
doc_link: https://docs.sentry.io/platforms/javascript/guides/capacitor/
support_level: production
type: framework
---

Install the Sentry Capacitor SDK alongside the sibling Sentry Angular SDK:

```bash
# npm
npm install --save @sentry/capacitor @sentry/angular-ivy

# yarn
yarn add @sentry/capacitor @sentry/angular @sentry/tracing --exact
```

Or install the standalone Sentry Capacitor SDK if you don't use Ionic/Angular:

```bash
# npm
npm install --save @sentry/capacitor @sentry/tracing

# yarn
yarn add @sentry/capacitor
```

<Note>

The version of the sibling SDK must match with the version referred by Sentry Capacitor. To check which version of the sibling SDK is installed, use the following command: `npm info @sentry/capacitor peerDependencies`

</Note>

## Capacitor 2 - Android Installation

<Note>

This step is not needed if you are using Capacitor 3

</Note>

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
  override fun onCreate(savedInstanceState: Bundle?) {
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

With Ionic/Angular:

```typescript
// app.module.ts
import * as Sentry from '@sentry/capacitor';
// Use `@sentry/angular-ivy` for Angular 12+ or `@sentry/angular` for Angular 10 or 11
import * as SentryAngular from '@sentry/angular-ivy';


Sentry.init(
  {
    dsn: '___PUBLIC_DSN___',
    // To set your release and dist versions
    release: 'my-project-name@' + process.env.npm_package_version,
    dist: '1',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    integrations: [
      new SentryAngular.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        routingInstrumentation: SentryAngular.routingInstrumentation,
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
    {
      provide: SentryAngular.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [SentryAngular.TraceService],
      multi: true,
    },
  ],
})
```

Standalone:

```javascript
// App.js
import * as Sentry from "@sentry/capacitor";

Sentry.init({
  dsn: "___PUBLIC_DSN___",

  // Set your release version, such as 'getsentry@1.0.0'
  release: "my-project-name@<release-name>",
  // Set your dist version, such as "1"
  dist: "<dist>",
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
throw new Error("Test Thrown Error");
```

Or trigger a native crash:

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.nativeCrash();
```
