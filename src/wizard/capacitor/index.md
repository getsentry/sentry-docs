---
name: Capacitor
doc_link: https://docs.sentry.io/platforms/capacitor/
support_level: production
type: framework
---

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your app works.

The Capacitor SDK is currently available for Android devices.
To install the Capacitor SDK, use npm or yarn:

```bash {tabTitle:npm}
npm install --save @sentry/capacitor
```

```bash {tabTitle:Yarn}
yarn add @sentry/capacitor
```

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

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

You should `init` the SDK as soon as possible during your app's creation stage.

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.init({
  dsn: "___PUBLIC_DSN___",

  // To set your release version
  release: "my-project-name@" + process.env.npm_package_version,
});
```

### Verifying Your Setup

Great! Now that you’ve completed setting up the SDK, maybe you want to quickly test out how Sentry works. Start by capturing an exception:

```javascript
import * as Sentry from "@sentry/capacitor";

Sentry.captureException("my test exception");
```
