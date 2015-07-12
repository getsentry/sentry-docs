Federated Sentry Documentation
==============================

This repository contains the documentation for docs.getsentry.com and some
support to build the entire documentation which in parts is made from
content of other repositories.

Understanding the Structure
---------------------------

The structure of this repository is broken into a few separate parts:

* ``build/``: this folder contains the final build artifacts.  At present
  only two builds are supported: ``html`` and ``dirhtml``.  They however
  use custom builders called ``sentryhtml`` and ``sentrydirhtml``.  For
  more information have a look into the `Makefile`.
* ``doc-modules/``: this folder contains references to the submodules for
  the individual split docs.  The ``docs/clients`` folder contains a bunch of
  symlinks that point to the appropriate place within the client doc
  folder for instance.
* ``design/``: this folder contains the JavaScript, CSS files and
  templates as well as some webpack related stuff for the final design of
  the documentation.
* ``doc-support``: this submodule references the sentry-doc-support
  repository which contains support for building federated docs.  See
  below for more information.

Building the Docs
-----------------

The point of the federated documentation system is that a whole cohesive
documentation can be built however the individual documentation for the
components can remain in the individual repositories.

For building the complete docs, you can use this command::

    make build

To clean the build use this::

    make clean

How the Docs Build
------------------

The building of the docs out of this repository is controlled by two
environment variables:

``SENTRY_FEDERATED_DOCS=1``:
    This is exported for all documentation builds from this repository
    directly.  It indicates that the documentation is build for the
    federation use case and can be picked up by individual client configs
    to change behavior.

``SENTRY_DOC_VARIANT``:
    This is set to either ``hosted`` or ``on-premise`` to indicate which
    flavor of sentry docs to build.  Within the docs the
    ``sentry:edition`` directive can be used to filter the docs.

Customizing Docs
----------------

To include or exclude parts of the documentation the ``sentry:edition``
directive comes in useful:

``.. sentry:edition:: self``:
    This only builds when the docs are built through the non federated
    build.

``.. sentry:edition:: hosted``:
    Only included if the docs are build for the hosted (getsentry.com)
    docs

``.. sentry:edition:: on-premise``:
    This only shows up in the on-premise version of the documentation.

Multiple variants can be defined with a comma.
