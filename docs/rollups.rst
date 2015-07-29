Rollups & Sampling
==================

An important part of Sentry is how it aggregates similar events together
and creates rollups.  This turns out to be a pretty complex issue and
it can be confusing for users about why some information might not be
grouped correctly.

There are two core pieces to understand:

- The structured data of an event dictates how a rollup is created. This
  varies depending on the data available as well as the language.

- Individual events are sampled and thus some raw events may not be
  available once the system has finished processing them.

Grouping Priorities
-------------------

The grouping switches behavior based on the interfaces
(:doc:`../clientdev/interfaces`) that are available within an event.

*   if the interfaces used in an event differ, then there is no chance for
    those events to be grouped together.
*   If a stacktrace or exception is involved in a report then grouping
    will only consider this information.
*   If a template is involved, then grouping will consider the template.
*   as a fallback it will use the message of the event for grouping.

Grouping by Stacktrace
``````````````````````

When Sentry detects a stacktrace in the event data (either directly or as
part of an exception) the grouping effectively is based entirely on the
stacktrace.  This grouping is fairly involved but easy enough to
understand.

The first and most important part is that Sentry only groups by stack
trace frames reported in the application.  Not all clients might report
this, but if that information is provided, it's used for grouping.  This
means that if the stacktrace is modified from one event to another
exclusively in parts of the stack that is not related to the application,
it still groups the same.

Depending on the information the following data can be used for each stack
trace frame:

*   module name
*   normalized filename (removed from revision hashes etc.)
*   normalized context line (essentially a cleaned up version of the
    sourcecode of the affected line if provided)

This grouping usually works well, but causes two annoying artifacts if not
dealt with:

*   minimized JavaScript sourcecode will destroy the grouping in really
    bad ways.  Because of this you should ensure Sentry can access your
    :ref:`raven-js-sourcemaps`.
*   if you modify your stacktrace by introducing a new level through the
    use of decorators, your stacktrace will change and so will the
    grouping.  For this matter many clients support hiding irrelevant
    stack trace frames.  For instance the Python client will skip all
    stack frames with a local variable called ``__traceback_hide__`` set
    to `True`).

Grouping By Exception
`````````````````````

If no stacktrace is available but exception info is, then the grouping
will consider the ``type`` and ``value`` of the exception.  If either does
not exist it's skipped.  This grouping is a lot less reliable because of
changing error messages.

Grouping by Template
````````````````````

If a template is involved the logic is similar to grouping by stacktrace
but obviously with less information as template traces have less data
available.  The general concept applies however.

Fallback Grouping
`````````````````

If everything else fails, grouping falls back to messages.  Hereby ideally
the grouping only uses the message without the parameters, but if that is
not available, it uses the message attribute.

.. _custom-grouping:

Custom Grouping
---------------

For some very advanced use cases clients can override the Sentry default
grouping.

Two common cases generally come up here:

- An RPC or external API service is queried, so the stacktrace is generally
  the same (even if the outgoing request is very different)

- A generic error, such as a database connection error, has many different
  stacktraces and never groups together.

To work around these the Sentry protocol supports a ``fingerprint`` attribute.

In supported clients, this attribute can be passed with the event information,
and should be an array of strings:

.. code-block:: javascript

    Raven.captureException(ex, {fingerprint: ['my', 'custom', 'fingerprint']})

Additionally if you simply wish to append information, thus making the grouping
slightly less aggressive, you can do that as well:

.. code-block:: javascript

    Raven.captureException(ex, {fingerprint: ['{{ default }}', 'other', 'data']})

Sampling
--------

Due to the large amount of data Sentry collects, it becomes impractical to
store all data about every event. Instead, Sentry stores a single entity
for every unique event (a group or rollup as we call it), and will then only store
a subset of the repeat events. We attempt to do this in an intelligent
manner so that it becomes almost invisible to you.

For example, when a new event comes in, it creates an aggregate. Several
of the following events will also create individual entries under that
aggregate. Once it we see a certain threshold reached of the same event,
we stop storing every entry, and instead store one in N events, as well as
one event every N seconds. Additionally, we will always store the first
event on a status change (e.g. you resolve an event and it happens again).
