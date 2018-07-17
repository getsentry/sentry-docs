---
title: Installation
sidebar_order: 0

installation_content:
  JavaScript / Browser: |
    Our Browser SDK should be used for any frontend application or Website.
    By default it will capture JavaScript exceptions and unhandled promises.  In addition we provide many integrations to handle framework specific error handling (e.g. React, Angular Vue, ...)

    Our recommended way of using Sentry for your website is to use our Loader.
    Just add this script at the top of your website and you are done, Sentry is fully setup and will catch errors for you.

    If you want to know more of what the Loader actually does, <a href="#TODO">click here</a>.

    ```javascript
    <script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous" />
    ```

    There are a few other ways to use / install our JavaScript SDK:

    You could use our CDN link directly and load the latest SDK version there:

    ```javascript
    <script src="https://browser.sentry-cdn.com/__VERSION:@sentry/browser__/bundle.min.js" crossorigin="anonymous" />
    ```

    or if you are using `npm` or `yarn` call:
    ```
    $ npm install @sentry/browser
    ```

  JavaScript / Node: |
    Our Node SDK should be used for Node application and supports many different framework integrations such as Express, ... #TODO

    Install our Node SDK using `npm` or `yarn`:
    ```
    $ npm install @sentry/node
    ```

  JavaScript / Electron: |
    Our Electron SDK can capture JavaScript exceptions in the main process and renderers, as well as collect native crash reports (Minidumps).

    Install our Electron SDK using `npm` or `yarn`:
    ```
    $ npm install @sentry/electron
    ```

  JavaScript / Cordova: |
    Our Cordova SDK can capture JavaScript exceptions as well as native crashs / exceptions that happen either on iOS or Android.

    Install our using:
    ```
    $ cordova plugin add sentry-cordova
    ```

  Python: |
    Test Python

  Ruby: |
    Test Ruby

---

Sentry provides many different SDKs for different programming languages / platforms.

Please select the language / platform you are looking for:

{% include components/platform_content.html content=page.installation_content %}