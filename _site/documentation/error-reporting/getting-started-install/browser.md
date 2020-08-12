The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous">
</script>
```

{% wizard hide %}
{% capture __alert_content -%}
It's possible to include `defer` in your script tag, but keep in mind that any errors which occur in scripts that execute before the browser SDK script executes won’t be caught (because the SDK won’t be initialized yet). We strongly recommend that if you use `defer`, you a) place the script tag for the browser SDK first, and b) mark it, and all of your other scripts, `defer` (but not `async`), thereby guaranteeing that it’s executed before any of the others.
{%- endcapture -%}
{%- include components/alert.html
  title="Use of defer"
  content=__alert_content
  level="warning"
%}

You can also [NPM install our browser library](?platform=browsernpm).
{% endwizard %}
