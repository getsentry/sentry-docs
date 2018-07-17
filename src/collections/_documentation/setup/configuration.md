---
title: Configuration
sidebar_order: 1

configuration_content:
  JavaScript / Browser: |
    - If you are using the <a href="#TODO">Loader</a> there are no additional steps you have to make.
    Sentry is set up and works.

    - If you are using Sentry via our CDN you have to call `init`.
    `Sentry` should be a top level key on the `window` object.

     ```javascript
    Sentry.init({dsn: '___PUBLIC_DSN___'});
    ```

    - If you are using the `npm` package you have to first include it and call `init`:

    ```javascript
    import { init } from '@sentry/browser';

    init({dsn: '___PUBLIC_DSN___'});
    ```

  JavaScript / Node: |
    ```javascript
    const Sentry = require('@sentry/node');

    init({dsn: '___PUBLIC_DSN___'});
    ```

  JavaScript / Electron: |
    ```javascript
    import { init } from '@sentry/electron';

    init({dsn: '___PUBLIC_DSN___'});
    ```

  JavaScript / Cordova: |
    ```javascript
    onDeviceReady: function() {
        ...
        var Sentry = cordova.require("sentry-cordova.Sentry");
        Sentry.init({ dsn: '___PUBLIC_DSN___' });
        ...
    }
    ```

  Python: |
    Test Python

  Ruby: |
    Test Ruby

---

In order for Sentry to work you need to _initialize_ the SDK you use.

{% include components/platform_content.html content=page.configuration_content %}