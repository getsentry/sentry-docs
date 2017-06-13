Breadcrumbs
===========

Sentry supports a concept called Breadcrumbs, which is a trail of
events which happened prior to an issue. Often times these events
are very similar to traditional logs, but also have the ability to
record more rich structured data.

Each crumb in the trail has the following attributes:

Message
    A string describing the event. The most common vector, often
    used as a drop-in for a traditional log message.

Data
    A mapping (str => str) of metadata around the event. This is
    often used instead of message, but may also be used in addition.

Category
    A category to label the event under. This generally is similar
    to a logger name, and will let you more easily understand the
    area an event took place, such as ``auth``.

Level
    The level may be any of ``error``, ``warning``, ``info``, or ``debug``.


Recording Crumbs
----------------

Each SDK will have an API native to its language, but we'll use our PHP
SDK as an example.

.. code-block:: php

    function loginUser($username, $password)
    {
        $sentryClient->breadcrumbs->record(array(
            'message' => 'Authenticating ' . $username,
            'category' => 'auth',
            'level' => 'info',
        ));

        // validate login

        $sentryClient->breadcrumbs->record(array(
            'message' => 'Successfully logged in ' . $username,
            'category' => 'auth',
            'level' => 'info',
        ));
    }
