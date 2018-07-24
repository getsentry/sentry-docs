 - If you are using the <a href="#TODO">Loader</a> there are no additional steps you have to make. Sentry is set up and works.

 - If you are using Sentry via our CDN you have to call `init`. `Sentry` should be a top level key on the `window` object.

    ```javascript
    Sentry.init({dsn: '___PUBLIC_DSN___'});
    ```

- If you are using the `npm` package you have to first include it and call `init`:

    ```javascript
    import { init } from '@sentry/browser';
    init({dsn: '___PUBLIC_DSN___'});
    ```
