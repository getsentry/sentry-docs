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
<script src="https://browser.sentry-cdn.com/{{ site.data.versions['raven-js'] }}:@sentry/browser__/bundle.min.js" crossorigin="anonymous" />
```

or if you are using `npm` or `yarn` call:
```
$ npm install @sentry/browser
```
