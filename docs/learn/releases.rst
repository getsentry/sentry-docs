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
#. Learn in which release an issue was first introduced / last seen
#. Resolving issues via commit messages (requires setting up commits, see below)
#. Suggested assignees (requires setting up commits, see below)
#. Detailed deploy emails to inform Sentry users of when their code is going out (requires setting up commits and deploys, see below)


Releases are better with commits
--------------------------------

If you connect a repository in Sentry, we'll create a webhook to start
collecting commit data. Once you're ready to create a release, you can
associate commits with a release either by sending us a list of commit
ids (shas) with their repos or just by including the current HEAD sha
and, optionally, the previous release's HEAD sha.

The easiest way to get started with this would be something like:

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
            "repository":"my-repo",
            "commit":"2da95dfb052f477380608d59d32b4ab9",
            "previousCommit":"1e6223108647a7bfc040ef0ca5c92f68ff0dd993"
        }],
        "projects":["my-project","my-other-project"]
    }
    '

In the above example, ``previousCommit`` is optional. If you don't
specify a ``previousCommit``, we'll look at the previous release's
``commit``. If it's your first time specifying `refs` with a release,
we'll start fetching commits in your next release.

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

Once you are sending commits (either as ``commits`` or ``refs``), you
can start including ``fixes <SHORT-ID>`` in your commit messages. Then,
once we identify a commit as being included in a release, we'll
automatically resolve that issue. You can find the short issue id at
the top of the issue details page, next to the assignee dropdown.

We'll also start suggesting assignees for issues based on changes
to files in an issue's stack trace once we have commit data.

For more information, you can check out our
:doc:`API <../api/releases/post-organization-releases/>`
or :ref:`CLI <sentry-cli-commit-integration>` docs.


Tell Sentry About Deploys
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
:ref:`iOS <sentry-swift-debug-symbols>` and :ref:`JavaScript <raven-js-sourcemaps>` docs.
