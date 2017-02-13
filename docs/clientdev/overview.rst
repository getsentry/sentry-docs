Overview
========

This part of the documentation guides you towards implementing a new
SDK for Sentry.  It covers the protocol for event submission as well as
guidelines for how clients should look and behave.

Writing an SDK
--------------

An SDK at its core is simply a set of utilities for capturing various
logging parameters. Given these parameters, it then builds a JSON payload
which it will send to a Sentry server using some sort of authentication
method.

The following items are expected of production-ready SDKs:

* DSN configuration
* Graceful failures (e.g. Sentry server unreachable)
* Scrubbing with processors
* Tag support

Feature based support is required for the following:

* If cookie data is available, it's not sent by default
* If POST data is available, it's not sent by default

Additionally, the following features are highly encouraged:

* Automated error handling (e.g. default error handlers)
* Logging integration (to whatever standard solution is available)
* Non-blocking event submission
* Basic data sanitization (e.g. filtering out values that look like passwords)
* Context data helpers

Usage for End-users
-------------------

Generally, using an SDK consists of three steps for the end user, which should
look almost identical no matter the language:

1. Creation of the SDK (sometimes this is hidden from the user)::

      var myClient = new SentryClient('{DSN}');

2. Capturing an event::

      var resultId = myClient.captureException(myException);

3. Using the result of an event capture::

      println('Your exception was recorded as %s', resultId);

The constructor ideally allows several configuration methods. The first
argument should always be the DSN value (if possible), followed by an
optional secondary argument which is a map of options::

    client = new SentryClient('{DSN}', {
        'tags': {'foo': 'bar'}
    })

.. note:: If an empty DSN is passed, you should treat it as valid option
   which signifies disabling the SDK.

Which options you support is up to you, but ideally you would provide
defaults for generic values that can be passed to the capture methods.

Once you accept the options, you should output a logging message
describing whether the SDK has been configured actively (as in, it will
send to the remote server), or if it has been disabled. This should be
done with whatever standard logging module is available for your platform.

Additionally, you should provide methods (depending on the platform) which
allow for capturing of a basic message and an exception-type:

* ``SentryClient.captureMessage(message)``
* ``SentryClient.captureException(exception)``

The above methods should also allow optional arguments (or a map of
arguments). For example::

    client.captureException(myException, {
        'tags': {'foo': 'bar'},
    })

If your platform supports block statements, it is recommended that you provide
something like the following::

    with client.captureExceptions(tags={'foo': 'bar'}):
        # do something that will cause an error
        1 / 0

.. note:: In the above example, we're passing any options that would
   normally be passed to the capture methods along with the block wrapper.

Finally, provide a CLI to test your SDK's configuration. Python example::

    raven test {DSN}

Ruby example::

    rake raven:test {DSN}

Parsing the DSN
---------------

SDKs are encouraged to allow arbitrary options via the constructor, but must
allow the first argument as a DSN string. This string contains the following bits::

    '{PROTOCOL}://{PUBLIC_KEY}:{SECRET_KEY}@{HOST}/{PATH}{PROJECT_ID}'

The final endpoint you'll be sending requests to is constructed per the
following::

    '{URI}/api/{PROJECT ID}/store/'

For example, given the following constructor::

    new SentryClient('https://public:secret@sentry.example.com/1')

You should parse the following settings:

* URI = ``https://sentry.example.com``
* Public Key = ``public``
* Secret Key = ``secret``
* Project ID = ``1``

The resulting POST request would then transmit to::

  'https://sentry.example.com/api/1/store/'

.. note:: If any of configuration values are not present, the SDK should notify the user
          immediately that they've misconfigured the SDK.

Building the JSON Packet
------------------------

The body of the post is a string representation of a JSON object.  For
example, with an included Exception event, a basic JSON body might
resemble the following:

.. sourcecode:: json

    {
      "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0",
      "culprit": "my.module.function_name",
      "timestamp": "2011-05-02T17:41:36",
      "tags": {
        "ios_version": "4.0"
      },
      "exception": [{
        "type": "SyntaxError",
        "value": "Wattttt!",
        "module": "__builtins__"
      }]
    }

The body of the event can carry attributes or interface values.  The
difference between them is that attributes are very barebones key/value pairs
(for the most part) and interfaces are rich styled interface elements.
Examples of attribute are ``event_id`` or ``tags`` whereas the ``exception``
key is an interface.

For a list of all supported attributes see :doc:`attributes`.  For a list
of built-in interfaces see :doc:`interfaces/index`.

Authentication
--------------

An authentication header is expected to be sent along with the message
body, which acts as an ownership identifier::

    X-Sentry-Auth: Sentry sentry_version=5,
      sentry_client=<client version, arbitrary>,
      sentry_timestamp=<current timestamp>,
      sentry_key=<public api key>,
      sentry_secret=<secret api key>

.. note:: You should include the SDK version string in the User-Agent
   portion of the header, and it will be used if ``sentry_client`` is not sent
   in the auth header.

In situations where it's not possible to send the custom ``X-Sentry-Auth``
header, it's possible to send these values via the querystring::

    ?sentry_version=5&sentry_key=<public api key>&sentry_secret=<secret api key>...

.. describe:: sentry_version

    The protocol version. The current version of the protocol is '7'.

.. describe:: sentry_client

    An arbitrary string which identifies your SDK, including its version.

    The typical pattern for this is '**client_name**/**client_version**'.

    For example, the Python SDK might send this as 'raven-python/1.0'.

.. describe:: sentry_timestamp

    The unix timestamp representing the time at which this event was generated.

.. describe:: sentry_key

    The public key which should be provided as part of the SDK configuration.

.. describe:: sentry_secret

    The secret key which should be provided as part of the SDK configuration.

    .. note:: You should only pass the secret key if you're communicating via
              secure communication to the server. Client-side behavior (such
              as JavaScript) should use CORS, and only pass the public key.

A Working Example
-----------------

When all is said and done, you should be sending an HTTP POST request to a
Sentry webserver, where the path is the
``BASE_URI/api/PROJECT_ID/store/``. So given the following DSN::

    https://b70a31b3510c4cf793964a185cfe1fd0:b7d80b520139450f903720eb7991bf3d@sentry.example.com/1

The request body should then somewhat resemble the following:

.. sourcecode:: http

    POST /api/1/store/ HTTP/1.1
    User-Agent: raven-python/1.0
    Content-Type: application/json
    X-Sentry-Auth: Sentry sentry_version=7,
      sentry_timestamp=1329096377,
      sentry_key=b70a31b3510c4cf793964a185cfe1fd0,
      sentry_secret=b7d80b520139450f903720eb7991bf3d,
      sentry_client=raven-python/1.0

    {
      "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0",
      "culprit": "my.module.function_name",
      "timestamp": "2011-05-02T17:41:36",
      "message": "SyntaxError: Wattttt!",
      "exception": [{
        "type": "SyntaxError",
        "value": "Wattttt!",
        "module": "__builtins__"
      }]
    }

Request Encoding
----------------

SDKs are heavily encouraged to gzip or deflate encode the request body
before sending it to the server to keep the data small.  The preferred
method for this is to send an ``Content-Encoding: gzip`` header.
Alternatively the server also accepts gzip compressed json in a base64
wrapper which is detected regardless of the header.  This allows you to
send compressed events in very restrictive environments.

Reading the Response
--------------------

If you're using HTTP, you'll receive a response from the server. The response
looks something like this:

.. sourcecode:: http

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
      "id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
    }

One thing to take note of is the response status code. Sentry uses this in
a variety of ways. You'll **always** want to check for a 200 response if
you want to ensure that the message was delivered, as a small level of
validation happens immediately that may result in a different response
code (and message).

For example, you might get something like this::

    HTTP/1.1 400 Bad Request
    X-Sentry-Error: Client request error: Missing client version identifier

    Client request error: Missing client version identifier


.. note:: The X-Sentry-Error header will always be present with the
   precise error message and it is the preferred way to identify the root
   cause.

   If it's not available, it's likely the request was not handled by the
   API server, or a critical system failure has occurred.

Handling Failures
-----------------

It is **highly encouraged** that your SDK handles failures from the
Sentry server gracefully. This means taking care of several key things:

* Soft failures when the Sentry server fails to respond in a reasonable
  amount of time (e.g. 3s)
* Exponential backoff when Sentry fails (don't continue trying if the
  server is offline)
* Failover to a standard logging module on errors.

For example, the Python SDK will log any failed requests to the Sentry
server to a named logger, ``sentry.errors``.  It will also only retry
every few seconds, based on how many consecutive failures its seen. The
code for this is simple::

    def should_try(self):
        if self.status == self.ONLINE:
            return True
        interval = min(self.retry_number, 6) ** 2
        return time.time() - self.last_check > interval

Tags
----

Tags are key/value pairs that describe an event. They should be
configurable in the following contexts:

* Environment (SDK-level)
* Thread (block-level)
* Event (as part of capture)

Each of these should inherit its parent. So for example, if you configure
your SDK as so::

    client = Client(..., {
        'tags': {'foo': 'bar'},
    })

And then you capture an event::

    client.captureMessage('test', {
        'tags': {'foo': 'baz'},
    })

The SDK should send the following upstream for ``tags``::

    {
        "tags": [
            ["foo", "bar"],
            ["foo", "baz"]
        ],
    }

Contextual Data
---------------

You should also provide relevant contextual interfaces. These should last
for the lifecycle of a request, and the general interface is "bind some
kind of context", and then at the end of a request lifecycle, clear any
present context.

This interface consists of `*_context` methods, access to the `context`
dictionary as well as a `clear` and `merge` context method.  Method
methods exist usually depend on the SDK.  The following methods
generally make sense:

*   ``client.user_context``
*   ``client.tags_context``
*   ``client.http_context``
*   ``client.extra_context``
*   ``client.context.merge``
*   ``client.context.clear``

For more information about this (specifically about how to deal with
concurrency) please make sure to read :doc:`context`.
