Attributes
==========

Attributes are simple data that Sentry understands to provide the most
basic information about events.  These are things like the unique ID of an
event, the human readable message etc.

Attributes are separate from :doc:`interfaces/index` which provide very specific
and tailored data such as exception data, stacktraces, etc.

Required Attributes
-------------------

The following attributes are required for all events:

.. describe:: event_id

    Hexadecimal string representing a uuid4 value.

    The length is exactly 32 characters (no dashes!)

    .. sourcecode:: json

        {
          "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
        }

.. describe:: timestamp

    Indicates when the logging record was created (in the Sentry SDK).

    The Sentry server assumes the time is in UTC.

    The timestamp should be in ISO 8601 format, without a timezone.

    .. sourcecode:: json

        {
          "timestamp": "2011-05-02T17:41:36"
        }

.. describe:: logger

    The name of the logger which created the record.

    .. sourcecode:: json

        {
          "logger": "my.logger.name"
        }


.. describe:: platform

    A string representing the platform the SDK is submitting from. This will
    be used by the Sentry interface to customize various components in the
    interface.

    .. sourcecode:: json

        {
          "platform": "python"
        }

    Acceptable values are:

    * ``as3``
    * ``c``
    * ``cfml``
    * ``cocoa``
    * ``csharp``
    * ``go``
    * ``java``
    * ``javascript``
    * ``node``
    * ``objc``
    * ``other``
    * ``perl``
    * ``php``
    * ``python``
    * ``ruby``

.. describe:: sdk

    Information about the SDK sending the event.

    .. sourcecode:: json

        {
          "sdk": {
            "name": "sentry-unity",
            "version": "1.0.0"
          }
        }

    .. versionadded:: Sentry 8.4



Optional Attributes
-------------------

Additionally, there are several optional values which Sentry recognizes and are
highly encouraged:

.. describe:: level

    The record severity.

    Defaults to ``error``.

    The value needs to be one on the supported level string values.

    .. sourcecode:: json

        {
          "level": "warning"
        }

    Acceptable values are:

    * ``fatal``
    * ``error``
    * ``warning``
    * ``info``
    * ``debug``

.. describe:: culprit

    The name of the transaction (or culprit) which caused this exception.

    For example, in a web app, this might be the route name: ``/welcome/``

    .. sourcecode:: json

        {
          "culprit": "my.module.function_name"
        }


.. describe:: server_name

    Identifies the host SDK from which the event was recorded.

    .. sourcecode:: json

        {
          "server_name": "foo.example.com"
        }


.. describe:: release

    The release version of the application.

    This value will generally be something along the lines of the git SHA
    for the given project.

    .. sourcecode:: json

        {
          "release": "721e41770371db95eee98ca2707686226b993eda"
        }


.. describe:: tags

    A map or list of tags for this event.

    .. sourcecode:: json

        {
          "tags": {
            "ios_version": "4.0",
            "context": "production"
          }
        }

    .. sourcecode:: json

        {
          "tags": [
            ["ios_version", "4.0"],
            ["context", "production"]
          ]
        }

.. describe:: environment

    The environment name, such as 'production' or 'staging'.

    .. sourcecode:: json

        {
          "environment": "production"
        }

    .. versionadded:: Sentry 8.0

.. describe:: modules

    A list of relevant modules and their versions.

    .. sourcecode:: json

        {
          "modules": {
            "my.module.name": "1.0"
          }
        }

.. describe:: extra

    An arbitrary mapping of additional metadata to store with the event.

    .. sourcecode:: json

        {
          "extra": {
            "my_key": 1,
            "some_other_value": "foo bar"
          }
        }

.. describe:: fingerprint

    An array of strings used to dictate the deduplication of this event.

    A value of ``{{ default }}`` will be replaced with the built-in behavior, thus
    allowing you to extend it, or completely replace it.

    .. sourcecode:: json

        {
          "fingerprint": ["myrpc", "POST", "/foo.bar"]
        }

    .. sourcecode:: json

        {
          "fingerprint": ["{{ default }}", "http://example.com/my.url"]
        }

    .. versionadded:: Protocol version '7'

For information about overriding grouping see :ref:`custom-grouping`.
