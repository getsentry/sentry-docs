Uploading Debug Symbols
=======================

A dSYM upload is required for Sentry to symoblicate your crash logs for
viewing. The symoblication process unscrambles Apple's crash logs to
reveal the function, variables, file names, and line numbers of the crash.
The dSYM file can be uploaded through the
`sentry-cli <https://github.com/getsentry/sentry-cli>`__ tool or through a
`Fastlane <https://fastlane.tools/>`__ action.

With Bitcode
````````````

If `Bitcode <https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AppThinning/AppThinning.html#//apple_ref/doc/uid/TP40012582-CH35-SW2>`__
**is enabled** in your project, you will have to upload the dSYM to Sentry
**after** it has finished processing in the iTunesConnect. The dSYM can be
downloaded in three ways.

Use Fastlane
~~~~~~~~~~~~

Use the `Fastlane's <https://github.com/fastlane/fastlane>`__ action,
`download_dsyms`, to download the dSYMs from iTunesConnect and upload to
Sentry. The dSYM won't be generated unitl **after** the app is done
processing on iTunesConnect so this should be run in its own lane.

.. sourcecode:: ruby

    lane :upload_symbols do
      download_dsyms
      upload_symbols_to_sentry(
        auth_token: '...',
        org_slug: '...',
        project_slug: '...',
      )
    end

If you have a legacy API key instead you can supply it with `api_key`
instead of `auth_token`.

.. sentry:edition:: on-premise

    By default fastlane will connect to app.getsentry.com.  For
    on-prem you need to provide the `api_host` parameter
    to instruct the tool to connect to your server::

        api_host: 'https://mysentry.invalid/'

Use 'sentry-cli`
~~~~~~~~~~~~~~~~

There are two ways to download the dSYM from iTunesConnect. After you do
one of the two following ways, you can upload the dSYM using
`sentry-cli <https://github.com/getsentry/sentry-cli/releases>`__.

1. Open Xcode Oraganizer, go to your app, and click "Download dSYMs..."
2. Login to iTunes Connect, go to your app, go to "Activity, click the
   build number to go into the detail page, and click "Download dSYM"

Afterwards manually upload the symbols with `sentry-cli`::

    sentry-cli --auth-token YOUR_AUTH_TOKEN upload-dsym --org YOUR_ORG_SLUG --project YOUR_PROJECT_SLUG PATH_TO_DSYMS

.. sentry:edition:: on-premise

    By default sentry-cli will connect to app.getsentry.com.  For
    on-prem you need to export the `SENTRY_URL` environment variable
    to instruct the tool to connect to your server::

        export SENTRY_URL=https://mysentry.invalid/

Without Bitcode
```````````````

Things are a bit easier if you do not use bitcode.  In that case you can
directly upload the symbols to Sentry as part of a build.

Use Fastlane
~~~~~~~~~~~~

If you are already using Fastlane you can use it in this situation as
well.  If you are not, you might prefer the `sentry-cli` integerated into
X-Code.

.. sourcecode:: ruby

    lane :build do
      gym
      upload_symbols_to_sentry(
        auth_token: '...',
        org_slug: '...',
        project_slug: '...',
      )
    end

If you have a legacy API key instead you can supply it with `api_key`
instead of `auth_token`.

.. sentry:edition:: on-premise

    By default fastlane will connect to app.getsentry.com.  For
    on-prem you need to provide the `api_host` parameter
    to instruct the tool to connect to your server::

        api_host: 'https://mysentry.invalid/'

Run Script with `sentry-cli`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Your project's dSYM can be upload during the build phase as a "Run
Script".  For this you need to st the `DEBUG_INFORMATION_FORMAT` to be
`DWARF with dSYM File`. By default, an Xcode project will only have
`DEBUG_INFORMATION_FORMAT` set to `DWARF with dSYM File` in `Release` so
make sure everything is set in your build settings properly.

1. You will need to copy the below into a new `Run Script` and set your
   `AUTH_TOKEN`, `ORG_SLUG`, and `PROJECT_SLUG`
2. Download and install `sentry-cli <https://github.com/getsentry/sentry-cli/releases>`__
   — The best place to put this is in the `/usr/local/bin/` directory

Shell: `/bin/bash`

.. sourcecode:: bash

    export SENTRY_ORG=your-org
    export SENTRY_PROJECT=your-project
    export SENTRY_AUTH_TOKEN=your-auth-token
    sentry-cli upload-dsym

The ``upload-dsym`` command automatically picks up the
``DWARF_DSYM_FOLDER_PATH`` environment variable that xcode exports and
look for dsym files there.

.. sentry:edition:: on-premise

    By default sentry-cli will connect to app.getsentry.com.  For
    on-prem you need to export the `SENTRY_URL` environment variable
    to instruct the tool to connect to your server::

        export SENTRY_URL=https://mysentry.invalid/

Manually with `sentry-cli`
~~~~~~~~~~~~~~~~~~~~~~~~~~

Your dSYM file can be upload manually by you (or some automated process)
with the `sentry-cli` tool. You will need to know the following
information:

- API Key
- Organization slug
- Project slug
- Path to the build's dSYM

Download and install
`sentry-cli <https://github.com/getsentry/sentry-cli/releases>`__ — The best
place to put this is in the `/usr/local/bin/` directory.

Then run this::

    sentry-cli --auth-token YOUR_AUTH_TOKEN upload-dsym --org YOUR_ORG_SLUG --project YOUR_PROJECT_SLUG PATH_TO_DSYMS

.. sentry:edition:: on-premise

    By default sentry-cli will connect to app.getsentry.com.  For
    on-prem you need to export the `SENTRY_URL` environment variable
    to instruct the tool to connect to your server::

        export SENTRY_URL=https://mysentry.invalid/
