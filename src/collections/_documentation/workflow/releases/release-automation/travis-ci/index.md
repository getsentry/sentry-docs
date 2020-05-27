---
title: Travis CI
sidebar_order: 4

---

This guide walks you through the process of automating Sentry release management and deploy notifications in Travis CI. After deploying in Travis CI, you’ll be able to identify suspect commits that are likely the culprit for new errors. You’ll also be able to apply source maps to see the original code in Sentry.

Before starting, confirm that your Sentry project is properly set up to track commit metadata by [installing a repository integration]({%- link _documentation/workflow/releases/index.md -%}#install-repo-integration). Once that's installed, and you've added your repository, come back to this guide. If you've already installed a repository integration, you're ready to go.

## Create a Sentry Internal Integration

For Travis CI to communicate securely with Sentry, you'll need to create a new internal integration. In Sentry, navigate to **Settings > Developer Settings > New Internal Integration**.

Give your new integration a name (for example, “Travis CI Deploy Integration”) and specify the necessary permissions. In this case, you need Admin access for “Release” and Read access for “Organization”.

For more details about scopes and API endpoints, see the full documentation on [API Permissions]({%- link _documentation/api/permissions.md -%}).

[{% asset releases/travis-ci/internal-integration-permissions.png alt="View of internal integration permissions." %}]({% asset releases/travis-ci/internal-integration-permissions.png @path %})

Click "Save", then record your token, which you'll need in the next section.

## Setting Environment Variables in Travis CI

Next, you'll need a few environment variables to configure the Sentry CLI:

- `SENTRY_AUTH_TOKEN` - Your internal integration token
- `SENTRY_ORG` - Your Sentry organization slug
- `SENTRY_PROJECT` - Your Sentry project slug

To access your internal integration token securely, store it as an [environment variable on your repository](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings):

1. In the Travis CI application, go to your repository's settings by clicking "Settings" from the "More options" menu.
2. Find the "Environment Variables" section.
3. Add a new variable with `SENTRY_AUTH_TOKEN` as the name and your internal integration token as the value.

[{% asset releases/travis-ci/travis-env-vars.png alt="View of Travis CI environment variables." %}]({% asset releases/travis-ci/travis-env-vars.png @path %})

The other variables do not contain sensitive information, so you'll use the `env` key to define them as environment variables in your .travis.yml file.

## Create Release and Notify Sentry of Deployment

To automate your Sentry release management process, you'll need to add the `Create release and notify Sentry of deploy` job below after your deploy step:

```yaml
jobs:
    include:
# ...
      - name: Create release and notify Sentry of deploy
        env: SENTRY_ORG=sample-organization-slug SENTRY_PROJECT=sample-project-slug SENTRY_ENVIRONMENT=production
        script: |
          curl -sL https://sentry.io/get-cli/ | bash
          export SENTRY_RELEASE=$(sentry-cli releases propose-version)
          sentry-cli releases new -p $SENTRY_PROJECT $SENTRY_RELEASE
          sentry-cli releases set-commits $SENTRY_RELEASE --auto
          sentry-cli releases files $SENTRY_RELEASE upload-sourcemaps path-to-sourcemaps-if-applicable
          sentry-cli releases finalize $SENTRY_RELEASE
          sentry-cli releases deploys $SENTRY_RELEASE new -e $SENTRY_ENVIRONMENT
```

For more details about the release management concepts in the snippet above, see the full documentation on [release management]({%- link _documentation/cli/releases.md -%}).

**Notes**:

- If you’re not deploying a JavaScript project or have sent source maps to Sentry using another method, omit the `upload-sourcemaps` line.
- If you can’t install a repository integration, send commit metadata via the [create release endpoint]({%- link _documentation/workflow/releases/index.md -%}#alternatively-without-a-repository-integration) or omit the `set-commits` line (`set-commits` is required for suspect commits).
- `sentry-cli releases propose-version` defaults to the commit SHA of the commit being deployed (recommended). To set this to a different version, modify `SENTRY_RELEASE` to the preferred version.