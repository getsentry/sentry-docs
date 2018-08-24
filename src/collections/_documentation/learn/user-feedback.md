---
title: 'User Feedback'
sidebar_order: 15
---

Sentry provides the ability to collect additional feedback from the user upon hitting an error. This is primarily useful in situations where you might generally render a plain error page (the classic `500.html`). To collect the feedback, an embeddable JavaScript widget is available, which can then be shown on demand to your users.

The following pieces of information are requested and collected:

-   The user’s name
-   The user’s email address
-   A description of what happened

When feedback is collected, Sentry will pair it up with the original event giving you additional insights into issues.

## Collecting Feedback

The integration process consists of running our JavaScript SDK (2.1 or newer), authenticating with your public DSN, and passing in the client-side generated Event ID.

For example, in Django this looks like the following:

```html
{% raw %}<!-- Sentry JS SDK 2.1.+ required -->
<script src="https://cdn.ravenjs.com/3.15.0/raven.min.js"></script>

{% if request.sentry.id %}
  <script>
  Raven.showReportDialog({
    eventId: '{{ request.sentry.id }}',

    // use the public DSN (dont include your secret!)
    dsn: '___PUBLIC_DSN___'
  });
  </script>
{% endif %}{% endraw %}
```

Often this will vary depending on how you handle errors – specifically routing and rendering errors. If you’ve got a more custom setup, you’ll simply need to pull out the event ID and pass it into the widget:

```python
class IndexController(Controller):
    def get(self, request):
        try:
            1 / 0
        except Exception:
            event_id = Raven.captureException()
            return render('500.html', {'sentry_event_id': event_id})
```

Then simply check for the ID in the template, and open the feedback dialog:

```html
{% raw %}<script src="https://cdn.ravenjs.com/3.15.0/raven.min.js"></script>

{% if sentry_event_id %}
  <script>
  Raven.showReportDialog({
    eventId: '{{ sentry_event_id }}',

    // use the public DSN (dont include your secret!)
    dsn: '___PUBLIC_DSN___'
  });
  </script>
{% endif %}{% endraw %}
```

Some integrations and frameworks will make this even easier:

-   [Browser JavaScript]({%- link _documentation/clients/javascript/usage.md -%}#javascript-user-feedback)
-   [Django]({%- link _documentation/clients/python/integrations/django.md -%}#python-django-user-feedback)
-   [Flask]({%- link _documentation/clients/python/integrations/flask.md -%}#python-flask-user-feedback)
-   [PHP]({%- link _documentation/clients/php/usage.md -%}#php-user-feedback)
-   [Cocoa]({%- link _documentation/clients/cocoa/advanced.md -%}#cocoa-user-feedback)

Take a look at your SDK’s documentation for more information.

## Customizing the Widget

Several parameters are available to customize the widget, specifically for localization. All options can be passed through the `showReportDialog` call.

An override for Sentry’s automatic language detection (e.g. `lang=de`)

| Param | Default |
| --- | --- |
| `lang` | _[automatic]_ – **override for Sentry’s language code** |
| `title` | It looks like we’re having issues. |
| `subtitle` | Our team has been notified. |
| `subtitle2` | If you’d like to help, tell us what happened below. – **not visible on small screen resolutions** |
| `labelName` | Name |
| `labelEmail` | Email |
| `labelComments` | What happened? |
| `labelClose` | Close |
| `labelSubmit` | Submit |
| `errorGeneric` | An unknown error occurred while submitting your report. Please try again. |
| `errorFormEntry` | Some fields were invalid. Please correct the errors and try again. |
| `successMessage` | Your feedback has been sent. Thank you! |
