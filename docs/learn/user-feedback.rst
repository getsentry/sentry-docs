User Feedback
=============

Sentry provides the ability to collect additional feedback from the user upon hitting
an error. This is primarily useful in situations where you might generally render a plain
error page (the classic ``500.html``). To collect the feedback, an embeddable JavaScript
widget is available, which can then be shown on demand to your users.

The following pieces of information are requested and collected:

- The user's name
- The user's email address
- A description of what happened

When feedback is collected, Sentry will pair it up with the original event giving you
additional insights into issues.

Collecting Feedback
-------------------

The integration process consists of running our JavaScript SDK (2.1 or newer), authenticating
with your public DSN, and passing in the client-side generated Event ID.

For example, in Django this looks like the following:

.. sourcecode:: html+django

    <!-- Sentry JS SDK 2.1.+ required -->
    <script src="https://cdn.ravenjs.com/2.3.0/raven.min.js"></script>

    {% if request.sentry.id %}
      <script>
      Raven.showReportDialog({
        eventId: '{{ request.sentry.id }}',

        // use the public DSN (dont include your secret!)
        dsn: '___PUBLIC_DSN___'
      });
      </script>
    {% endif %}

Take a look at your SDK's documentation for more details on integrating User Feedback.
