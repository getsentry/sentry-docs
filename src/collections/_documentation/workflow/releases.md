---
title: Releases
sidebar_order: 0
release_identifier: "my-project-name"
release_version: "2.3.12"
---

A release is a version of your code that is deployed to an environment. When you give Sentry information about your releases, you unlock a number of new features:

-   Determine the issues and regressions introduced in a new release
-   Predict which commit caused an issue and who is likely responsible
-   Resolve issues by including the issue number in your commit message
-   Receive email notifications when your code gets deployed

Additionally, releases are used for applying [source maps]({%- link _documentation/platforms/javascript/sourcemaps.md -%}) to minified JavaScript to view original, untransformed source code.

## Setting up Releases

Setting up releases fully is a 4-step process:

1.  [Configure Your SDK](#configure-sdk)
2.  [Install Repository Integration](#install-repo-integration)
3.  [Create Release and Associate Commits](#create-release)
3.  [Tell Sentry When You Deploy a Release](#create-deploy)

### Configure Your SDK {#configure-sdk}

Include a release ID (a.k.a version) where you configure your client SDK. This is commonly a git SHA or a custom version number.

There are a few restrictions -- the release name cannot contain newlines, spaces, or "\\\", be ".", "..", or exceed 200 characters.

{% capture __alert_content -%}
Releases are global per organization, so make sure to prefix them with something project-specific.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

{% include components/platform_content.html content_dir='set-release' %}

How you make the version available to your code is up to you. For example, you could use an environment variable that is set during the build process.

This tags each event with the release value. We recommend that you tell Sentry about a new release before deploying it, as this will unlock a few more features (explained in Step 2). But if you don’t, Sentry will automatically create a release entity in the system the first time it sees an event with that release ID.

After this, you should see information about the release, such as new issues and regressions introduced in the release.

{% asset releases-overview.png %}

### Install Repository Integration {#install-repo-integration}

This step is optional - you can manually supply Sentry with your own commit metadata if you wish. Skip ahead to [this section](#alternatively-without-a-repository-integration) to learn how to do this.

Using one of Sentry's repository integrations (e.g. GitHub, GitLab, Bitbucket, etc.) is the easiest way to connect your commit metadata to Sentry. For a list of available integrations, go to Organization Settings > Integrations.

{% capture __alert_content -%}
You need to be an Owner or Manager of your Sentry organization to set up or configure an integration. Read more about [roles in Sentry]({%- link _documentation/accounts/membership.md -%}).
{%- endcapture -%}
{%- include components/alert.html
  content=__alert_content
  title="Note"
  level="warning"
%}

{% asset releases-repo-integrations.png %}

Once you are in Organization Settings > Integrations and have installed the integration, click the 'Configure' button next to your instance.

{% asset releases-repo-add.png %}

In the 'Repositories' panel, click 'Add Repository', and add any repositories you'd like to track commits from. The integration will then send Sentry metadata (such as authors and files changed) about each commit pushed to those repositories.

If you’re linking a GitHub repository, ensure you have Admin or Owner permissions on the repository, and that Sentry is an authorized GitHub app in your [GitHub account settings](https://github.com/settings/applications).

If you’re still having trouble adding it, you can try to [disconnect](https://sentry.io/account/settings/identities/) and then [reconnect](https://sentry.io/account/settings/social/associate/github/) your GitHub identity.

### Create Release and Associate Commits {#create-release}

In this step, you tell Sentry about a new release and which commits are associated with it. This allows Sentry to pinpoint, which commits likely caused an issue, and allow your team to resolve issues by referencing the issue number in a commit message.


#### Associate Commits with a Release

In your release process, add a step to create a release object in Sentry and associate it with commits from your linked repository.

There are 2 ways of doing this:

1.  Using Sentry’s [Command Line Interface]({%- link _documentation/cli/index.md -%}#sentry-cli) (**recommended**)
2.  Using the API

##### Using the CLI

```bash
# Assumes you're in a git repository
export SENTRY_AUTH_TOKEN=...
export SENTRY_ORG=my-org
VERSION=$(sentry-cli releases propose-version)

# Create a release
sentry-cli releases new -p project1 -p project2 $VERSION

# Associate commits with the release
sentry-cli releases set-commits --auto $VERSION
```

{% capture __alert_content %}
You need to make sure you’re using [Auth Tokens]({%- link _documentation/api/auth.md -%}#auth-tokens), **not** [API Keys]({%- link _documentation/api/auth.md -%}#api-keys), which are deprecated.
{% endcapture %}
{%- include components/alert.html
  content=__alert_content
  title="Note"
  level="warning"
%}

In the above example, we’re using the `propose-version` sub-command to determine a release ID automatically. Then we’re creating a release tagged `VERSION` for the organization `my-org` for projects `project1` and `project2`. Finally, we’re using the `--auto` flag to determine the repository name automatically, and associate commits between the previous release’s commit and the current head commit with the release. If the previous release doesn't have any commits associated with it, we’ll use the latest 20 commits.

If you want more control over which commits to associate, or are unable to execute the command inside the repository, you can manually specify a repository and range:

`sentry-cli releases set-commits --commit "my-repo@from..to" $VERSION`

Here we are associating commits (or refs) between `from` and `to` with the current release, `from` being the previous release’s commit. The repository name `my-repo` should match the name you entered when linking the repo in the previous step, and is of the form `owner-name/repo-name`. The `from` commit is optional and we’ll use the previous release’s commit as the baseline if it is excluded.

For more information, see the [CLI docs]({%- link _documentation/cli/releases.md -%}).

###### Finalizing Releases

By default a release is created “unreleased”. Finalizing a release means that we fill in a second timestamp on the release record, which is prioritized over `date_created` when sorting releases in the UI. This also affects what counts as "the next release" for resolving issues, what release is used as the base for associating commits if you use `--auto`, and creates an entry in the Activity stream.

This can be changed by passing either `--finalize` to the `new` command which will immediately finalize the release or you can separately call `sentry-cli releases finalize VERSION` later on. The latter is useful if you are managing releases as part of a build process e.g.

```bash
#!/bin/sh
sentry-cli releases new "$VERSION"
# do your build steps here
# once you are done, finalize
sentry-cli releases finalize "$VERSION"
```
You can also choose to finalize the release when you've made the release live (when you've deployed to your machines, enabled in the App store, etc.).

##### Using the API

```bash
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
```

If you’d like to have more control over what order the commits appear in, you can send us a list of all commits. That might look like this:

```python
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
```

For more information, see the [API reference]({%- link _documentation/api/releases/post-organization-releases.md -%}).

{% include components/alert.html
  title='Troubleshooting'
  content='If you receive an "Unable to Fetch Commits" email, take a look at our [Help Center Article](https://help.sentry.io/hc/en-us/articles/360019866834-Why-am-I-receiving-the-email-Unable-to-Fetch-Commits-).'
  level='warning'
%}

#### After Associating Commits

After this step, **suspect commits** and **suggested assignees** will start appearing on the issue page. We determine these by tying together the commits in the release, files touched by those commits, files observed in the stack trace, authors of those files, and [ownership rules]({%- link _documentation/workflow/issue-owners.md -%}).

{% asset suspect-commits-highlighted.png %}

Additionally, you will be able to resolve issues by including the issue ID in your commit message. You can find the issue id at the top of the issue details page, next to the assignee dropdown. For example, a commit message might look like this:

```bash
Prevent empty queries on users

Fixes SENTRY-317
```

When Sentry sees this commit, we’ll reference the commit in the issue, and when you create a release in Sentry we’ll mark the issue as resolved in that release.

{% include components/alert.html
  title="GitHub and Identifying Commit Authors"
  content="If you’re using GitHub, you may have a privacy setting enabled which prevents Sentry from identifying the user’s real email address. If you wish to use the suggested owners feature, you’ll need to ensure “Keep my email address private” is unchecked in GitHub’s [account settings](https://github.com/settings/emails)."
  level="warning"
%}

#### Alternatively: Without a Repository Integration

If you don't want Sentry to connect to your repository, or you're using an unsupported repository provider or VCS (e.g. Perforce), you can alternatively tell Sentry about your raw commit metadata via the API using the [create release endpoint]({%- link _documentation/api/releases/post-organization-releases.md -%}).

##### Formatting Commit Metadata

In order for Sentry to use your commits, you must format your commits to match this form:

```json
{
    "commits": [
        {
        "patch_set": [
            {"path": "path/to/added-file.html", "type": "A"},
            {"path": "path/to/modified-file.html", "type": "M"},
            {"path": "path/to/deleted-file.html", "type": "D"}
        ],
        "repository": "owner-name/repo-name",
        "author_name": "Author Name",
        "author_email": "author_email@example.com",
        "timestamp": "2018-09-20T11:50:22+03:00",
        "message": "This is the commit message.",
        "id": "8371445ab8a9facd271df17038ff295a48accae7"
        }
    ]
}
```

`patch_set`

: A list of the files that have been changed in the commit. Specifying the `patch_set` is necessary to power suspect commits and suggested assignees. It consists of two parts:

    `path`
    : The path to the file. Both forward and backward slashes (`'/' '\\'`) are supported.

    `type`
    : The types of changes that happend in that commit. The options are:
        - `Add (A)`
        - `Modify (M)`
        - `Delete (D)`

`repository`
: The full name of the repository the commit belongs to. If this field is not given Sentry will generate a name in the form: `u'organization-<organization_id>'` (i.e. if the organization id is `123`, then the generated repository name will be `u'organization-123`).

`author_email`
: The commit author's email is required to enable the suggested assignee feature.

`author_name`
: The commit author's name may also be included.

`timestamp`
: The commit timestamp is used to sort the commits given. If a timestamp is not included, the commits will remain sorted in the order given.

`message`
: The commit message.

`id`
: The commit id.

##### Create the Release with Patch Data

Below is an example of a full request to the create release endpoint that includes commit metadata:

```bash
curl https://sentry.io/api/0/organizations/your-organization-name/releases/ \
  -X POST \
  -H 'Authorization: Bearer <Token>' \
  -H 'Content-Type: application/json' \
  -d '
 {
 "version": "2.0rc2",
 "projects":["project-1","project-2"],
 "commits":[
     {
        "patch_set": [
            {"path": "path/to/added-file.html", "type": "A"},
            {"path": "path/to/modified-file.html", "type": "M"},
            {"path": "path/to/deleted-file.html", "type": "D"}
        ],
        "repository": "owner-name/repo-name",
        "author_name": "Author Name",
        "author_email": "author_email@example.com",
        "timestamp": "2018-09-20T11:50:22+03:00",
        "message": "This is the commit message.",
        "id": "8371445ab8a9facd271df17038ff295a48accae7"
    }
 ]
 }
 '
```

For more information, see the [API reference]({%- link _documentation/api/releases/post-organization-releases.md -%}).


### Tell Sentry When You Deploy a Release {#create-deploy}

Tell Sentry when you deploy a release and we’ll automatically send an email to Sentry users who have committed to the release that is being deployed.

{% asset deploy-emails.png %}

You must have environment [context]({%- link _documentation/enriching-error-data/additional-data.md -%}) set in your SDK in order to use this feature. To let Sentry know you’ve deployed, just send an additional request after creating a release:

```bash
sentry-cli releases deploys VERSION new -e ENVIRONMENT
```

You can also use our [API]({%- link _documentation/api/releases/post-release-deploys.md -%}) to create a deploy.

## Release Artifacts

JavaScript and iOS projects can utilize release artifacts to unminify or symbolicate error stack traces. To learn more, please check out our [iOS]({%- link _documentation/clients/cocoa/index.md -%}#sentry-cocoa-debug-symbols) and [JavaScript]({%- link _documentation/platforms/javascript/sourcemaps.md -%}) docs.

## Release Health

{% capture __alert_content -%}
Sentry’s Release Health features are currently in beta. For more details about access to these features, feel free to reach out to mobile@sentry.io.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Monitor the health of releases by observing user adoption, usage of the application, percentage of [crashes](#crash), and [session data](#session). Release health will provide insight into the impact of crashes and bugs as it relates to user experience, and reveal trends with each new issue through the release details, graphs, and filters.

### How Release Health Works

Once configured, Sentry's mobile and browser SDKs will send health data about the usage of your application.

The primary component that Sentry uses to monitor health is a session. A session represents the interaction of the user with the application and starts when a user opens the application. When a user closes the application or has a prolonged period of inactivity, the session ends.

Sessions are submitted to Sentry so you can track the usage and adoption of your application. When a user of your application experiences a crash, error, or abnormal exit, the session will be flagged accordingly, and Sentry calculates derived metrics. The metrics include data such as the number of users that didn't experience a crash in the specified time range. Sentry connects the metrics to the specific version of your application and the associated code.

### Releases Index

The releases index page provides a high-level view of:

- Each release version
- The associated project
- The authors of each commit
- The percentage of crash-free users
- The percentage of crash-free sessions

Each release links to one project. If a release has multiple projects, Sentry will duplicate the release data in relation to each project. The data will present adoption of the release from the most recent 24 hours.

[{% asset releases/release_index.png alt="View of the release index page showing each version of projects related to the release and the project details." %}]({% asset releases/release_index.png @path %})

### Time Range Change

When you change the date range, Sentry recalculates the values. Sentry doesn't provide the average value of the daily crash-free users or daily crash-free sessions, but the actual value of those metrics calculated for the selected time period. The number can significantly change based on the selected time range. For example:

Let's say you selected the 24-hour time range, have seven users that are using your application for seven days, and each day one of them experiences a crash. The Release Index page will show you that every day there were 85.7% crash-free users on the release.

In contrast, let's say you selected the seven-day time range, have seven users, and each day a different user experiences a crash. By the end of the week, the Release Index page will show you the project had 0% crash-free users.

### Release Details

The release details page focuses on an individual release. Elements of the release are presented in visual trends for crashes and sessions, specifics regarding each issue, and commit author breakdowns.

[{% asset releases/release_details.png alt="View of the release details page showing an overview graph, files changed, and other details." %}]({% asset releases/release_details.png @path %})

For more information about Sentry's Mobile features, see the full documentation for [Android SDK]({%- link _documentation/platforms/android/index.md -%}) and [iOS SDK](docs.sentry.io/platforms/cocoa/).

### Getting Started

Currently, we only support the health functionality for Android and iOS applications.

##### Android

To benefit from the health data provided in Releases v2, you must use at least 2.1.0 of the Android SDK, and enable the collection of release health metrics in the AndroidManifest.xml file.

For more details, see the [full documentation on using Release Health with Android]({%- link _documentation/platforms/android/index.md -%}#release-health).

#### iOS
To benefit from the health data provided in Releases v2, you must use at least version 5.0.0 Beta 2 of the Cocoa SDK and enable the collection of the release health metrics by adding `“enableAutoSessionTracking": true` into options during the initialization of the SDK.

For more details, see the [full documentation on using Release Health with iOS]({%- link _documentation/platforms/cocoa/index.md -%}#release-health).

### Data Filtering

Sentry has inbound data filters. These filters are exclusively applied at ingest time and not later in processing. This, for instance, lets one discard an error by error message when the error is ingested through the JSON API. On the other hand, this filter doesn't apply to ingested minidumps.
Data filters are only partially supported for session events, and they might be working slightly different:

#### Equivalent Filters

**release filter**
This filter discards events of a particular release. If sessions are started or updated and would match this filter, sessions are silently discarded entirely. This is consistent with error events.

**web crawler filter**
When session events send their user agent, they are discarded the same way as error events are. There might be a slight difference in the fallback case where the user agent of the sending SDK is used (browser javascript).

**legacy browsers**
This works exactly like the web crawler filter. No sessions are created or updated for legacy browsers when enabled.

**ip filter**
Throws away sessions of a specific IP.

#### Unsupported Filters

**error message filter**
This filter does not apply for sessions. Even if a user is discarding such errors, they will count against their stability score. An alternative measure *could be* to discard such sessions entirely if an error of this type is filtered out, but we believe this would make the system harder to understand.

**browser extensions**
Since the logic for detecting such errors requires all the error information, we cannot support this filter at the session ingest time. If we want to improve this case, we could retroactively discard such sessions entirely once we identify such an error case.

## Release Health Glossary

### Session

The time when the user is interacting with the application. (The application is in foreground)

- Session begins with the start of the application. Or, it begins with bringing the already started application back from background to the foreground.

- Session ends with the closing of the application or with the application being sent to the background.

- If the application is in the background for less than 30 seconds, we do not need to start the session again.

- Applications that are active even on the background (for example, music player) should track the sessions separately for the background process.

### Active Users

Number of users that started the application at least once in the specified time period.

### Crash

The fatal error that caused the crash of the application. Errors that did not cause the end of the application should not be included.

### Crash Free User

Percentage of the users that did not experience a crash during the specified time period.

### Crash Free Sessions

Number of sessions in the specified time range that did not end by the crash of the application.

### Crashed Users

Number of users that experienced a crash in the specified time range.

### Release Adoption

Number of users that started at least once during the specified time period of a specific release

### Release Version

A shorter version of the name = name without the package or short version of the hash
