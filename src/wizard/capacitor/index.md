---
name: Capacitor
doc_link: https://docs.sentry.io/platforms/javascript/guides/capacitor/
support_level: production
type: framework
---

Install the Sentry Capacitor SDK alongside the sibling Sentry Angular SDK:

```bash
# npm
npm install --save @sentry/capacitor @sentry/angular

# yarn
yarn add @sentry/capacitor @sentry/angular
```

Or install the standalone Sentry Capacitor SDK if you don't use Ionic/Angular:

```bash
# npm
npm install --save @sentry/capacitor

# yarn
yarn add @sentry/capacitor
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

With Ionic/Angular:

```typescript
// app.module.ts
import * as Sentry from "@sentry/capacitor";
import * as SentryAngular from "@sentry/angular";

Sentry.init(
  {
    dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",

    // To set your release and dist versions
    release: "my-project-name@" + process.env.npm_package_version,
    dist: "1"
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

Standalone:

```javascript
// App.js
import * as Sentry from "@sentry/capacitor";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",

  // Set your release version, such as "getsentry@1.0.0"
  release: "my-project-name@<release-name>",
  // Set your dist version, such as "1"
  dist: "<dist>"
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
