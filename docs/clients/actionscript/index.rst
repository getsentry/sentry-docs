.. sentry:edition:: hosted, on-premise

    .. class:: platform-perl

    ActionScript
    ============

.. sentry:support-warning::

    The ActionScript SDK is maintained and supported by the Sentry community. Learn more about the project on `GitHub <https://github.com/skitoo/raven-as3>`_.

The ActionScript SDK currently only works with AS3.

Installation
------------

Grab the source code from GitHub:

.. code-block:: shell

    git clone https://github.com/skitoo/raven-as3.git

Now simply add it to your class path.


Configuring the SDK
-------------------

Create a new instance of the SDK:

.. code-block:: actionscript

    var client : RavenClient = new RavenClient('___DSN___');


Reporting Errors
----------------

The best way to report errors is using a ``try...catch`` block:

.. code-block:: actionscript

    try
    {
      throw new Error("an error");
    }
    catch(e : Error)
    {
      client.captureException(e);
    }

Resources
---------

* `Bug Tracker <https://github.com/skitoo/raven-as3/issues>`_
* `Github Project <https://github.com/skitoo/raven-as3>`_
