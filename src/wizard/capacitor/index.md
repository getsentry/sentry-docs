---
name: Capacitor
doc_link: https://docs.sentry.io/platforms/capacitor/
support_level: production
type: framework
---

## Integrating the SDK

The Capacitor SDK is currently available for Android devices. To install the Capacitor SDK, use either `npm` or `yarn`:

# Using npm
npm install --save @sentry/capacitor
# Using yarn
yarn add @sentry/capacitor

Add the plugin declaration to your `MainActivity.java` file

```java {filename:MainActivity.java}
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

### Connecting the SDK to Sentry

You should `init` the SDK as soon as possible during your app's creation stage.

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.init({
  dsn: "___PUBLIC_DSN___",

  // To set your release version
  release: "my-project-name@" + process.env.npm_package_version,
});
```

### Send Your First Event

This snippet includes an intentional error, so you can test that everything is working as soon as you set it up:

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.captureException("my test exception");
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
