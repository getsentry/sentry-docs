Event Grouping
==============

An important part of Sentry is how it groups messages together.  This
turns out to be a pretty complex issue and it can be confusing for users
about why some information might not be grouped correctly.

This document describes the current grouping behavior that the Sentry
server applies to events and how it can be overridden in very special
cases.

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
    :ref:`sourcemaps`.
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
grouping.  It's very important to understand that this grouping comes with
certain disadvantages.  The biggest one is that you need to be very sure
about your grouping as there is no way to fix up grouping afterwards.

We have generally been facing out support for custom grouping but it will
remain a feature for specific uses we cannot handle in Sentry
automatically.

To implement custom grouping a ``checksum`` attribute can be sent with the
events.  If supplied it needs to be a 32 character value (for instance a
hexadecimal MD5 hash) and will be the exclusive identifier for grouping.
