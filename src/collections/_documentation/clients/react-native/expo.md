---
title: 'Using Sentry with Expo'
robots: noindex
---

[Expo](https://expo.io/) is an awesome way to quickly create and play around with your react native app. Now you can also use Sentry together with Expo, which is pretty simple to do:

```bash
$ npm i sentry-expo --save
```

In your `main.js` or `app.js`:

```javascript
import Sentry from 'sentry-expo';
// import { SentrySeverity, SentryLog } from 'react-native-sentry';
Sentry.config('___PUBLIC_DSN___').install();
```

Make sure to use your public DSN instead of the private one.

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

Note that `sentry-expo` only catches JavaScript exceptions (as opposed to native crashes). You can learn more [here](https://docs.expo.io/versions/latest/guides/errors/#what-about-native-errors) and [here](https://github.com/expo/sentry-expo/issues/87).

If you still need more help, you can out the docs directly on [Expo’s docs page](https://docs.expo.io/versions/latest/guides/using-sentry/)
