---
title: Loader
sidebar_order: 30000
---

We recommend using our bundled CDN version for the browser as explained [here]({% link _documentation/learn/quickstart.md %}?platform=browser#pick-a-client-integration).

But we also offer an alternative which is still in *beta*, we call it the _Loader_.

You install by just adding this script to you website instead of the SDK bundle.
This line is everything you need, this script is <1kB gzipped and includes the `Sentry.init` call with your DSN.

```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>
```

### What does the Loader provide?

It's small wrapper around our SDK.  
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
<script>
  Sentry.forceLoad();
  Sentry.onLoad(() => {
    // Use whatever Sentry.* function you want
  });
</script>
```

### Current limitations

As we inject our SDK asynchronously we will only monitor _global errors_ and _unhandled promise_ for you until the SDK is fully loaded.
That means that it could be that we miss breadcrumbs on the way that happened during the download.  
For example a user clicking on a button or your website is doing a XHR request.  
We will not miss any errors, only breadcrumbs and only up until the SDK is fully loaded.
You can reduce this time by manually calling `forceLoad` or set `data-lazy="no"`.
So keep this in mind.
