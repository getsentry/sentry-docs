The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>
```

{% wizard hide %}
{% include components/alert.html
  title="Don't like the CDN?"
  content="You can also [NPM install our browser library](?platform=browsernpm)"
  level="info"
%}
{% endwizard %}