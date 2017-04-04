Releases
========

.. note:: Some features of releases are still in beta. If you'd like to check them out, consider joining our early adopter program.


What is a Release?
------------------

Releases are used by Sentry to provide you with additional context
when determining the cause of an issue. You set a release context in
your SDK, and can either create a release via our API or allow Sentry
to create one automatically when we receive an event with a new
release version.

Setting up releases in Sentry is helpful as it will give you access
to the following features:

#. Marking issues as resolved in the next release
#. Resolving issues via commit messages (requires setting up commits, see below)
#. Suggested assignees (requires setting up commits, see below)
#. Detailed deploy emails to inform Sentry users of when their code is going out (requires setting up commits and deploys, see below)


Releases are better with commits
--------------------------------

If you connect a repository in Sentry, we'll create a webhook to start
collecting commit data. Once you're ready to create a release, you can
associate commits with a release either by sending us a list of commit
ids (shas) with their repos or just by including the current HEAD sha
and the previous release's HEAD sha. For more information, you can check
out our `API <https://docs.sentry.io/api/releases/post-organization-releases/>`_ or
`CLI <https://docs.sentry.io/learn/cli/releases/#commit-integration>`_ docs.


Tell Sentry About Deploys
-------------------------

Letting Sentry know when you've deployed a given release to an environment
unlocks another feature: Deploy emails. Deploy emails are automatically
sent to users who have committed to a release that is being deployed.


Release Artifacts
-----------------

Javascript and iOS projects can utilize release artifacts to unminify or
symbolicate error stack traces. To learn more, please check out our
`iOS <https://docs.sentry.io/clients/cocoa/#debug-symbols>`_ and
`JavaScript <https://docs.sentry.io/clients/javascript/sourcemaps/>`_ docs.
