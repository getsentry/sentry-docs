---
title: CoffeeScript
sidebar_order: 4
---

In order to use raven-node with coffee-script or another library which overwrites Error.prepareStackTrace you might run into the exception “Traceback does not support Error.prepareStackTrace being defined already.”

In order to not have raven-node (and the underlying raw stack trace library) require Traceback you can pass your own stackFunction in the options. For example:

```coffeescript
{% raw %}client = new raven.Client('___PUBLIC_DSN___', {
    stackFunction: {{ Your stack function }}
});{% endraw %}
```

So for example:

```coffeescript
client = new raven.Client('___PUBLIC_DSN___', {
    stackFunction: Error.prepareStackTrace
});
```
