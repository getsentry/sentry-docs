---
name: Ionic
doc_link: https://docs.sentry.io/platforms/javascript/guides/capacitor/
support_level: production
type: framework
---

To use Sentry in your Ionic app, install the Sentry Capacitor SDK alongside the sibling Sentry SDK related to the Web framework you're using with Ionic.
The supported siblings are: Angular `@sentry/angular`, React `@sentry/react` and Vue `@sentry/vue`.

Heres an example of installing Sentry Capacitor along with Sentry Angular:
```
npm install --save @sentry/capacitor @sentry/angular
```
or
```
yarn add @sentry/capacitor @sentry/angular
```
The same installation process applies to the other siblings, all you need to do is to replace `@sentry/angular` by the desired sibling.

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

```javascript
import * as Sentry from "@sentry/capacitor";
// The example is using Angular, Import "@sentry/vue" or "@sentry/react" when using a Sibling different than Angular.
import * as SentrySibling from "@sentry/angular";
// For automatic instrumentation (highly recommended)
import { BrowserTracing } from "@sentry/tracing";

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
  // Forward the init method to the sibling Framework.
  SentrySibling.init
);
```

Additionally for Angular, you will also need to alter NgModule (same code doesn't apply to other siblings)

```javascript
@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      // Attach the Sentry ErrorHandler
      useValue: SentrySibling.createErrorHandler(),
    },
  ],
})
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
