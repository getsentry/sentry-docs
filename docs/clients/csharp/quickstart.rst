Getting Started
===============

A `NuGet Package <https://www.nuget.org/packages/SharpRaven>`_ is
available for SharpRaven if you don't want to compile it yourself.

Instantiate the client with your DSN:

.. sourcecode:: csharp

    var ravenClient = new RavenClient("___DSN___");

Capturing Exceptions
--------------------

Call out to the client in your catch block:

.. sourcecode:: csharp

    try
    {
        int i2 = 0;
        int i = 10 / i2;
    }
    catch (Exception e)
    {
        ravenClient.CaptureException(e);
    }

Logging Non-Exceptions
----------------------

You can capture a message without being bound by an exception:

.. sourcecode:: csharp

    ravenClient.CaptureMessage("Hello World!");

Additional Data
---------------

The capture methods allow you to provide additional data to be sent with
your request. ``CaptureException`` supports both the ``tags`` and extra
``properties``, and ``CaptureMessage`` additionally supports the
``level`` property.

The full argument specs are:

.. sourcecode:: csharp

    CaptureException(Exception e,
                     IDictionary<string, string> tags = null,
                     object extra = null)
    CaptureMessage(string message,
                   ErrorLevel level = ErrorLevel.info,
                   Dictionary<string, string> tags = null,
                   object extra = null)
