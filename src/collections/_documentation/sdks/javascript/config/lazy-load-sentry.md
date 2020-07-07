---
title: Lazy Loading Sentry
excerpt: ""
---
We recommend using our bundled CDN version for the browser as explained in the [installation](sdks/javascript/index.md) instructions for our JavaScript SDK. In addition, if you want to use `defer`, you can, though any errors that occur in scripts that execute before the SDK script executes won’t be caught (because the SDK won’t be initialized yet). If you opt to use `defer`, you’ll need to: 

1. Place the script tag for the browser SDK first
2. Mark it, and all of your other scripts, `defer` (but not `async`), which will guarantee that it’s executed before any of the others.

We also offer an alternative we call the *Loader*. You install by adding this script to your website instead of the SDK bundle. This line is everything you need; the script is <1kB gzipped and includes the `Sentry.init` call with your DSN.

```bash
<script src="___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>
```

## **Select the SDK Version to Load**

Go into the Sentry web UI, view *Settings -> Projects -> Client Keys (DSN),* then press the **Configure** button. From here, you can view the options to configure your DSN and select which SDK version the Loader should load.

**Note:** It can take a few minutes until the change is visible in the code, since it’s cached.

[{% asset js-loader-settings.png %}]({% asset js-loader-settings.png @path %})

### What the Loader Provides

The Loader is a small wrapper around our SDK, which does a few things:

- You will always have the newest recommended stable version of our SDK.
- It captures all *global errors* and *unhandled promise* rejections.
- It lazy injects our SDK into your website.
- After you’ve loaded the SDK, the Loader will send everything to Sentry.

By default, the Loader contains all information needed for our SDK to function, like the `DSN`. In case you want to set additional [options](config-js-basics) you have to set them like this:

`onLoad` is a function that only the Loader provides; Loader will call it once it injects the SDK into the website. The Loader `init()` works a bit differently as well; instead of just setting the options, we merge the options internally, only for convenience, so you don’t have to set the `DSN` again because the Loader already contains it.

As explained, the Loader lazy loads and injects our SDK into your website, but you can also tell the loader to fetch it immediately instead of only fetching it when you need it. Setting `data-lazy` to `no` will tell the Loader to inject the SDK as soon as possible:

```html
<script> 
Sentry.onLoad(function() {
    // Use whatever Sentry.* function you want
  });
  Sentry.forceLoad();
</script>
```

### **Current limitations**

Because we inject our SDK asynchronously, we will only monitor *global errors* and *unhandled promise* for you until the SDK is fully loaded. That means that we might miss breadcrumbs during the download.

For example, a user clicking on a button on your website is making an XHR request. We will not miss any errors, only breadcrumbs and only up until the SDK is fully loaded. You can reduce this time by manually calling `forceLoad` or set `data-lazy="no"`.