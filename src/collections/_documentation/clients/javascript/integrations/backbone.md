---
title: Backbone
sidebar_order: 8
---

<!-- WIZARD -->
## Installation

Start by adding the `raven.js` script tag to your page. It should be loaded as early as possible.

```html
<script src="https://cdn.ravenjs.com/3.26.4/raven.min.js"
    crossorigin="anonymous"></script>
```

## Configuring the Client

Next configure Raven.js to use your Sentry DSN:

```javascript
Raven.config('___PUBLIC_DSN___').install()
```

At this point, Raven is ready to capture any uncaught exception.
<!-- ENDWIZARD -->
