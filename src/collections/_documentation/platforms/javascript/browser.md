---
title: Browser
sidebar_order: 20
---

We recommend using our bundled CDN version for the browser as explained [here]({% link _documentation/learn/quickstart.md %}?platform=browser#pick-a-client-integration).

### What does the CDN version provide?

The script you add to your website is a small wrapper around our SDK, we call it _Loader_.  
The _Loader_ does a few things:

- You will always have the newest recommend stable version of our SDK.
- It captures all _global errors_ and _unhandled promise_ rejections.
- It lazy injects our SDK into your website.
- After the SDK is loaded everything will be sent to Sentry.

By default, the _Loader_ contains all information needed for our SDK to function, like the `DSN`.  In case you want to set additional [options]({% link _documentation/learn/configuration.md %}) you have to set them like this:


```javascript
Sentry.onLoad(() => {
  Sentry.init({
    release: '1.0.0',
    environment: 'prod'
  });
});
```

`onLoad` is a function the only the _Loader_ provides, it will be called once the SDK has been injected into the website.  With the _Loader_ `init()` works a bit different, instead of just setting the options, we merge the options internally, only for convenience so you don't have to set the `DSN` again since the _Loader_ already contains it.

As explained before, the _Loader_ lazy loads and injects our SDK into your website but you can also tell the loader to fetch it immediately instead of only fetching it when you need it. Setting `data-lazy` to `no` will tell the _Loader_ to inject the SDK as soon as possible:

```html
<script
  src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js"
  crossorigin="anonymous"
  data-lazy="no">
</script>
```

The _Loader_ also provides a function called `forceLoad()` which does the same, so you can do the following:

```html
{% raw %}{% if sentry_event_id %}
<script>
  Sentry.forceLoad();
  Sentry.onLoad(() => {
    // Use whatever Sentry.* function you want
  });
</script>
{% endif %}{% endraw %}
```