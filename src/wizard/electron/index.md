---
name: Electron
doc_link: https://docs.sentry.io/platforms/javascript/guides/electron/
support_level: production
type: language
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

If you are using `yarn` or `npm` you can add our package as a dependency:

```bash
# Using yarn
yarn add @sentry/electron

# Using npm
npm install --save @sentry/electron
```

You need to call `init` in the `main` process and every `renderer` process you spawn.
For more details about Electron [click here](/platforms/electron/)

```javascript
import * as Sentry from "@sentry/electron";

Sentry.init({ dsn: "___PUBLIC_DSN___" });
```

One way to verify your setup is by intentionally causing an error that breaks your application.

Calling an undefined function will throw an exception:

```javascript
myUndefinedFunction();
```

You may want to try inserting this into both your `main` and any `renderer`
processes to verify Sentry is operational in both.
