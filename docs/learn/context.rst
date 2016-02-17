Adding Context
==============

Context can be added into events in a few various ways:

Tags
    Key/value pairs which generate breakdowns and search filters

User
    Information about the current actor

Extra
    Arbitrary unstructured data which is stored with an event sample

Context is considered to be request state, and thus should be cleared
out at the beginning (or end) of each operation. Clients like the JavaScript
client usually won't need to worry about this as they are generally are not
long lived.

Tagging Events
--------------

Sentry implements a system it calls tags. Tags are various key/value pairs
that get assigned to an event, and can later be used as a breakdown or
quick access to finding related events.

Several common uses for tags include:

*   The hostname of the server
*   The version of your platform (e.g. iOS 5.0)
*   The user's language

Once you've starting sending tagged data, you'll see it show up in a few places:

*   The filters within the sidebar on the project stream page.
*   Summarized within an event on the sidebar.
*   The tags page on an aggregated event.

We'll automatically index all tags for an event, as well as the frequency
and the last time a value has been seen. Even more so, we keep track of
the number of distinct tags, and can assist in you determining hotspots
for various issues.

Most clients generally support configuring tags at the global client level
configuration, as well as on a per event basis.

For example, in the JavaScript client:

.. code-block:: javascript

    Raven.captureMessage('hello world!', {tags: {
        locale: 'en-us'
    }});

Or to bind tags to the request context:

.. code-block:: javascript

    Raven.setTagsContext({
        environment: "production"
    });

Capturing the User
------------------

Sending users to Sentry will unlock a number of features, primarily the ability to drill
down into the number of users affecting an issue, as well to get a broader sense about
the quality of the application.

Users consist of a few key pieces of information which are used to construct a unique
identity in Sentry. Each of these is optional, but one **must** be present in order for
the user to be captured:

.. describe:: id

    Your internal identifier for the user.

.. describe:: username

    The username. Generally used as a better label than the internal ID.

.. describe:: email

    An alternative to a username (or addition). Sentry is aware of email addresses
    and can show things like Gravatars, unlock messaging capabilities, and more.

.. describe:: ip_address

    The IP address of the user. If the user is unauthenticated providing the IP
    address will suggest that this is unique to that IP. We will attempt to pull this
    from HTTP request data if available.

Additionally you can provide arbitrary key/value pairs beyond the reserved names and those
will be stored with the user.

Capturing the user is fairly straight forward. For example, in the JavaScript client:

.. code-block:: javascript

    Raven.setUserContext({
        email: 'foo@example.com'
    });


Extra Context
-------------

In addition to the structured context that Sentry understands, you can send arbitrary
key/value pairs of data which will be stored alongside the event. These are not indexed
and are simply used to add additional information about what might be happening.

Extra context can generally be passed in both the event constructor, as well as the
global context state:

For example, in the JavaScript client:

.. code-block:: javascript

    Raven.setExtraContext({
        arbitrary: {key: value},
        foo: "bar"
    });
