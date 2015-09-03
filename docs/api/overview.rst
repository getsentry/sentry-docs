Overview
========

The Sentry API is used for submitting events to the Sentry collector as
well as performing management tasks.  The reporting and management APIs
are individually versioned.  This document refers to the management APIs
only.  For information about the reporting API see
:doc:`../clientdev/index`.

API Versions
------------

The current version of the management API is dubbed ``v0`` and is
considered to be in a draft phase. While we don't expect public endpoints
to add change greatly, keep in mind that the API is still under
development.

General Rules
-------------

All management API requests should be made to the ``/api/0/`` prefix, and
will return JSON as the response::

    $ curl -i https://app.getsentry.com/api/0/

.. sourcecode:: http

    HTTP/1.0 200 OK
    Date: Sat, 14 Feb 2015 18:47:20 GMT
    Content-Type: application/json
    Content-Language: en
    Allow: GET, HEAD, OPTIONS

    {"version": "0"}

Sentry makes an attempt to stick to appropriate methods, but we always
prioritize usability over correctness.

=========== ==============================================================
Method      Description
=========== ==============================================================
``DELETE``  Used for deleting resources.
``GET``     Used for retrieving resources.
``OPTIONS`` Describes the given endpoint.
``POST``    Used for creating resources.
``PUT``     Used for updating resources. Partial data is accepted where
            possible.
=========== ==============================================================

Parameters and Data
-------------------

Any parameters not included in the URL should be encoded as JSON with a
Content-Type of ``'application/json'``::

    $ curl -i https://app.getsentry.com/api/0/projects/1/groups/ \
        -d '{"status": "resolved"}' \
        -H 'Content-Type: application/json'

Additional parameters are sometimes specified via the querystring, even
for ``POST``, ``PUT``, and ``DELETE`` requests::

    $ curl -i https://app.getsentry.com/api/0/projects/1/groups/?status=unresolved \
        -d '{"status": "resolved"}' \
        -H 'Content-Type: application/json'

Authentication
--------------

API requests are made using organization-level API keys. They're passed
using HTTP Basic auth where the username is your api key, and the password
is empty.

As an example, to get information about the project which your key is
bound to, you might make a request like so::

    $ curl -u API_KEY: https://app.getsentry.com/api/0/projects/1/

You might notice that some API calls refer to user based authentication.
This is somethign that is currently only available for internal calls to
the API with a user cookie.

Pagination
----------

Pagination in the API is handled via the Link header standard::

    $ curl -i https://app.getsentry.com/api/0/projects/1/groups/

.. sourcecode:: http

    HTTP/1.0 200 OK
    Date: Sat, 14 Feb 2015 18:47:20 GMT
    Content-Type: application/json
    Content-Language: en
    Allow: GET, HEAD, OPTIONS
    Link: <https://app.getsentry.com/api/0/projects/1/groups/?&cursor=1420837590:0:1>;
      rel="previous"; results="false",
      <https://app.getsentry.com/api/0/projects/1/groups/?&cursor=1420837533:0:0>;
      rel="next"; results="true"

In this example we have both a 'previous' link and a 'next' link. The
meaning of these links depends on the input query, but in our above
example the 'previous' page would be page index -1, and the next page
would be page index 1.

When supported, cursors will **always** be returned for both a previous
and a next page, even if there are no results on these pages. This allows
you to make a query against the API for yet-undiscovered results. An
example where this would be used is when you're implementing polling
behavior and you want to see if there is any new data. To help understand
if you actually need to paginate we return a ``results="[true|false]"``
indicator.
