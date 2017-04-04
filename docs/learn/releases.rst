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
and the previous release's HEAD sha. For more information, you can check
out our :doc:`API <../api/releases/post-organization-releases/>` or
:ref:`CLI <sentry-cli-commit-integration>` docs.

An example of what this might look like is:

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

    # you can choose to send all commits or just
    # the beginning and end commits
    commits = log.stdout.read().strip().split('\n')
    head_commits = [{
        'repository': 'my-repo-name',
        'previousId': sha_of_previous_release,
        'currentId': commits[0],
    }]

    data = {
        'commits': [{'id': c, 'repository': 'my-repo-name'} for c in commits],
        'headCommits': head_commits,
        'version': commits[0],
        'projects': ['my-project', 'my-other-project'],
    }

    res = requests.post(
        'https://sentry.io/api/0/organizations/my-org/releases/',
        json=data,
        headers={'Authorization': 'Bearer {}'.format(SENTRY_API_TOKEN)},
    )



Tell Sentry About Deploys
-------------------------

Letting Sentry know when you've deployed a given release to an environment
unlocks another feature: Deploy emails. Deploy emails are automatically
sent to users who have committed to a release that is being deployed.


Release Artifacts
-----------------

Javascript and iOS projects can utilize release artifacts to unminify or
symbolicate error stack traces. To learn more, please check out our
:ref:`iOS <sentry-swift-debug-symbols>` and :ref:`JavaScript <raven-js-sourcemaps>` docs.
