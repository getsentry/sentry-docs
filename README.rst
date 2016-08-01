Federated Sentry Documentation
==============================

This repository contains the documentation for docs.sentry.io and some
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

For building the required environment, you can use this command::

    make requirements

For building the complete docs, you can use this command::

    make build

To clean the build use this::

    make clean

At this point you'll need a real webserver to serve the docs otherwise
various browser security controls will block some of our JavaScript::

    bin/web

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
    This is set to either ``hosted`` or ``self`` to indicate which
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

Multiple variants can be defined with a comma.

Doc Sync Hook
-------------

This repository has a helpful bot that listens to a webhook that can be
used to update the cross references on commits automatically.  The hook is
available at ``https://sentry-doc-hook.herokuapp.com/``.  It can be
registered on any github repository that is referenced as a submodule
here.  By default it only tracks the master branch and changes below
``/docs``.

To override the branch you can pass ``?branches=`` as parameter which is a
comma separated list of branches.  To override the tracked paths provide
``?prefixes=`` which is a comma seperated list of path prefixes.
