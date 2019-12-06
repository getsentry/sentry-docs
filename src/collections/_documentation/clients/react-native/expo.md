---
title: 'Using Sentry with Expo'
robots: noindex
---

[Expo](https://expo.io/) is an awesome way to quickly create and play around with your react native app. Now you can also use Sentry together with Expo which is pretty simple todo:

```bash
$ npm i sentry-expo --save
```

In your `main.js` or `app.js`:

```javascript
import Sentry from 'sentry-expo';
// import { SentrySeverity, SentryLog } from 'react-native-sentry';
Sentry.config('___PUBLIC_DSN___').install();
```

Note that for Expo you have to use you public DSN instead of the private one. This is due to the fact that Expo isn’t using the native integration yet, this could change in future releases.

For uploading source maps you have to add this to your `exp.json` or `app.json`

```javascript
{
  // ... your existing exp.json configuration is here

  "hooks": {
    "postPublish": [
      {
        "file": "sentry-expo/upload-sourcemaps",
        "config": {
          "organization": "your team short name here",
          "project": "your project short name here",
          "authToken": "your auth token here"
        }
      }
    ]
  }
  // ...
}
```

If you still need more help you can out the docs directly on [Expo’s docs page](https://docs.expo.io/versions/latest/guides/using-sentry/)
