---
title: 'Using Sentry with Expo'
---

[Expo](https://expo.io/) is an excellent way to quickly create and play around with your react native app. Now you can also use Sentry together with Expo which is pretty simple todo:

```bash
npm install sentry-expo --save
# OR
yard add sentry-expo
```

In your `main.js` or `app.js`:

```javascript
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: '__PUBLIC_DSN__',
  enableInExpoDevelopment: true,
  debug: true
});
```

For uploading source maps you have to add this to your `exp.json` or `app.json`.

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

If you still need more help you can out the docs directly on [Expo’s docs page](https://docs.expo.io/versions/latest/guides/using-sentry/).
