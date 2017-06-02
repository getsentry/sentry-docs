Releases
========

.. container:: admonition

    **Note:** Some features of releases are still in beta. If you'd like to
    check them out, consider joining our early adopter program.

What is a Release?
------------------

Releases are used by Sentry to provide you with additional context
when determining the cause of an issue. You set a release context in
your SDK, and can either create a release via our API or allow Sentry
to create one automatically when we receive an event with a new
release version. Once a release is created, we'll provide an overview in the UI:

.. image:: img/releases-overview.png

Setting up releases in Sentry is helpful as it will give you access
to the following features:

- Marking issues as resolved in the next release
- Learn which release an issue was first introduced or last seen in
- Resolving issues via commit messages (requires setting up commits, see below)
- Suggested owners on issues (requires setting up commits, see below)
- Detailed deploy emails to inform Sentry users of when their code is going out (requires setting up commits and deploys, see below)

Releases are better with commits
--------------------------------

If you connect a repository in Sentry, we'll create a webhook to start
collecting commit data. Once you're ready to create a release, you can
associate commits with a release either by sending us a list of commit
ids (shas) with their repos or just by including the current HEAD sha
and, optionally, the previous release's HEAD sha.

To get started, you'll need to first add the repository. To do this, go to
your organization's dashboard, click "Repositories", and click
"Add Repository". You'll need to be an Owner or Manager of your Sentry
organization to do this.

Once added, Sentry will automatically collect commits for the repository,
and you can begin referencing it in releases. To do so, you'll need
to send ``refs`` along when you create a release. **Note:** You need to
make sure you're using :ref:`Auth Tokens <auth-tokens>` **not**
:ref:`API Keys <api-keys>`, which are deprecated.

.. code-block:: bash

    # Create a new release
    curl https://sentry.io/api/0/organizations/:organization_slug/releases/ \
      -X POST \
      -H 'Authorization: Bearer {TOKEN}' \
      -H 'Content-Type: application/json' \
      -d '
      {
        "version": "2da95dfb052f477380608d59d32b4ab9",
        "refs": [{
            "repository":"owner-name/repo-name",
            "commit":"2da95dfb052f477380608d59d32b4ab9",
            "previousCommit":"1e6223108647a7bfc040ef0ca5c92f68ff0dd993"
        }],
        "projects":["my-project","my-other-project"]
    }
    '

In the above example, we're telling Sentry that this release contains
the ``owner-name/repo-name`` repository (this name should match the name
you entered when setting up the repo), in which the current version (HEAD) is
``2da95dfb052f477380608d59d32b4ab9``. We're also giving it the previous
version (``previousCommit``), which is optional, but will help Sentry
be more accurate with building the commit list. If it's your first time
specifying `refs` with a release and you don't send along ``previousCommit``
we'll fetch the 10 most recent commits for that repository.
For subsequent releases, we'll be able to determine the commits
involved based on the previous release.

For a more convenient method you can use the :ref:`sentry-cli` tool which
can automatically push releases and commits up for you::

    export SENTRY_AUTH_TOKEN=...
    export SENTRY_ORG=organization-slug
    VERSION=$(sentry-cli releases propose-version)
    sentry-cli releases new -p my-project -p my-other-project $VERSION
    sentry-cli releases set-commits --auto $VERSION

Alternately, if you'd like to have more control over what order the
commits appear in, you can send us a list of all commits. That might
look like this:

.. code-block:: python

    import subprocess
    import requests

    SENTRY_API_TOKEN = <my_api_token>
    sha_of_previous_release = <previous_sha>

    log = subprocess.Popen([
        'git',
        '--no-pager',
        'log',
        '--no-merges',
        '--no-color',
        '--pretty=%H',
        '%s..HEAD' % (sha_of_previous_release,),
    ], stdout=subprocess.PIPE)

    commits = log.stdout.read().strip().split('\n')

    data = {
        'commits': [{'id': c, 'repository': 'my-repo-name'} for c in commits],
        'version': commits[0],
        'projects': ['my-project', 'my-other-project'],
    }

    res = requests.post(
        'https://sentry.io/api/0/organizations/my-org/releases/',
        json=data,
        headers={'Authorization': 'Bearer {}'.format(SENTRY_API_TOKEN)},
    )

For more information, you can check out our
:doc:`API <../api/releases/post-organization-releases/>`
or :ref:`CLI <sentry-cli-commit-integration>` docs.

Resolving issues via commits
----------------------------

Once you are sending commits (either as ``commits`` or ``refs``), you
can start including ``fixes <SHORT-ID>`` in your commit messages. Then,
once we identify a commit as being included in a release, we'll
automatically resolve that issue. You can find the short issue id at
the top of the issue details page, next to the assignee dropdown.

For example, a commit message might look like this:

.. code-block:: bash

    Prevent empty queries on users

    Fixes SENTRY-317


When Sentry sees this commit, we'll automatically annotate the matching
issue with a reference to the commit, and upon deploy, we'll mark the issue
as resolved.

Suggested owners
----------------

Once we have commit data associated with releases, we'll be able to start
suggesting owners for issues. To do this, we look at the commit author's email
address and automatically pair it up with any primary or secondary member
addresses in the system.

Once we've identified the authors, we'll compare the stacktrace of the issue
to the files changed within a given release. If we find any potential owners,
we'll suggest them on the issues details page.

A note on Github
~~~~~~~~~~~~~~~~

If you're using GitHub, you may have a privacy setting enabled which prevents
Sentry from identifying the user's real email address. If you wish to use the
suggested owners feature, you'll need to ensure "Keep my email address private"
is unchecked in `GitHub's account settings <https://github.com/settings/emails>`_.


Tell Sentry about deploys
-------------------------

Letting Sentry know when you've deployed a given release to an environment
unlocks another feature: Deploy emails.

To let Sentry know you've deployed, you'd just send an additional request
after creating a release via our API:

.. code-block:: bash

    # Create a new deploy
    curl https://sentry.io/api/0/organizations/:organization_slug/releases/:release_version/deploys/ \
      -X POST \
      -H 'Authorization: Bearer {TOKEN}' \
      -H 'Content-Type: application/json' \
      -d '
      {
        "environment": "production",
        "name": "my-deploy"
    }
    '

If you've already configured a repo with Sentry, when you create a deploy,
we'll automatically send an email to Sentry users who have committed to
the release that is being deployed.

For more details, check out our :doc:`API <../api/releases/post-release-deploys/>` docs.


Release Artifacts
-----------------

Javascript and iOS projects can utilize release artifacts to unminify or
symbolicate error stack traces. To learn more, please check out our
:ref:`iOS <sentry-cocoa-debug-symbols>` and :ref:`JavaScript <raven-js-sourcemaps>` docs.
