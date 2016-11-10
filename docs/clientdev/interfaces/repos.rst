Repos Interface
===============

An interface which describes the local repository configuration for an
application. This is used to map up source code information to stored
repository configuration.

For example, it is used to say the file ``bar/foo.py`` lives in the
``getsentry/raven-python`` repo, and is located at ``src/bar/foo.py``.

Repositories are configured using the absolute file path as the key,
and the configuration object as the value:

.. sourcecode:: json

    "repos": {
      "/abs/path/to/raven": {
        "name": "getsentry/raven-python"
      }
    }

Each repository configuration may contain the following attributes:

``name``
    The name of the repository as it is registered in Sentry.
``prefix``
    The optional prefix path to apply to source code when pairing it up with
    files in the repository.
``revision``
    The optional current revision of the local repository.

.. versionadded:: 8.11.0
