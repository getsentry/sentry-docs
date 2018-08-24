---
title: SessionStack
sidebar_order: 6
---

## SessionStack error session replay plugin for Sentry

To integrate the SessionStack player within your Sentry error reports, follow the steps below: Add your web app to your SessionStack account

[{% asset create-website-open.png %}]({% asset create-website-open.png @path %})

Add the SessionStack JavaScript snippet into the head element of your web app.

```html
<!-- Begin SessionStack code -->
<script type="text/javascript">
    !function(a,b){var c=window;c.SessionStackKey=a,c[a]=c[a]||{t:b,
    q:[]};for(var d=["start","stop","identify","getSessionId","log"],e=0;e<d.length;e++)!function(b){
    c[a][b]=c[a][b]||function(){c[a].q.push([b].concat([].slice.call(arguments,0)));
    }}(d[e]);var f=document.createElement("script");f.async=1,f.src="https://cdn.sessionstack.com/sessionstack.js";
    var g=document.getElementsByTagName("script")[0];g.parentNode.insertBefore(f,g);
    }("SessionStack","<YOUR_TOKEN>");
</script>
<!-- End SessionStack Code -->
```

To associate each Sentry event with the respective user session at the time the error occurred, an additional snippet needs to be added to your web app:

```html
<!-- Begin SessionStack-Sentry code -->
<script type="text/javascript">
    SessionStack.getSessionId(function(s){s&&Raven.setDataCallback(function(t){return t
    .contexts=t.contexts||{},t.contexts.sessionstack={session_id:s,timestamp:(new Date).
    getTime()},t})});
</script>
<!-- End SessionStack-Sentry code -->
```

-   Get your SessionStack website ID from the Settings section. You’ll need it later to configure the SessionStack plugin from within your Sentry project

[{% asset Screenshot_1.png %}]({% asset Screenshot_1.png @path %})

Create an API token for your web app:

[{% asset before_token_creation.png %}]({% asset before_token_creation.png @path %})

-   Go back to your Sentry project to configure the SessionStack plugin. Go to your Sentry project settings and find the SessionStack plugin under All integrations.

[{% asset Screenshot_2.png %}]({% asset Screenshot_2.png @path %})

-   Click Configure plugin and enter your SessionStack email, API token and website ID.

[{% asset configure_plugin.png %}]({% asset configure_plugin.png @path %})

-   Go to your Entry reports to find the Play session button. The session replay will start 5 seconds before the error occurred so that you can see what user steps led to the error.

[{% asset screenshot-sentry.io-2017-04-10-15-19-40-1.png %}]({% asset screenshot-sentry.io-2017-04-10-15-19-40-1.png @path %})
