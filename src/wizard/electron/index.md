---
name: Electron
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=electron
support_level: production
type: language
---
If you are using `yarn` or `npm` you can add our package as a dependency:

```bash
# Using yarn
$ yarn add @sentry/electron@1.5.2

# Using npm
$ npm install @sentry/electron@1.5.2
```




You need to call `init` in your `main` and every `renderer` process you spawn.
For more details about Electron [click here](/platforms/electron/)  

```javascript
import * as Sentry from '@sentry/electron';

Sentry.init({dsn: '___PUBLIC_DSN___'});
```



One way to verify your setup is by intentionally sending an event that breaks your application.

Calling an undefined function will throw an exception:

```js
myUndefinedFunction();
```

You may want to try inserting this into both your `main` and any `renderer`
processes to verify Sentry is operational in both.
