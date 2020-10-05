---
name: Electron
doc_link: https://docs.sentry.io/platforms/javascript/guides/electron/
support_level: production
type: language
---

If you are using `yarn` or `npm` you can add our package as a dependency:

```bash
# Using yarn
yarn add @sentry/electron

# Using npm
npm install --save @sentry/electron
```

You need to call `init` in your `main` and every `renderer` process you spawn.
For more details about Electron [click here](/platforms/electron/)

```javascript
import * as Sentry from "@sentry/electron";

Sentry.init({ dsn: "___PUBLIC_DSN___" });
```

One way to verify your setup is by intentionally causing an error that breaks your application.

Calling an undefined function will throw an exception:

```js
myUndefinedFunction();
```

You may want to try inserting this into both your `main` and any `renderer`
processes to verify Sentry is operational in both.
