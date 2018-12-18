---
title: GitLab
sidebar_order: 6
---

Sentry’s new GitLab integration helps you find and fix bugs faster by using data from your GitLab commits. Additionally, you can streamline your triaging process by creating a GitLab issue directly from Sentry.

## Configure GitLab

{% capture __alert_content -%}
Sentry owner or manager permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.

1. Within Integrations, find the GitLab icon and click **Install**.

    [{% asset gitlab/integration-pg.png alt="GitLab icon and install button" %}]({% asset gitlab/integration-pg.png @path %})

1. In the resulting modal, click **Add Installation**.

    [{% asset gitlab/add-installation.png alt="Connect Sentry to a GitLab instance" %}]({% asset gitlab/add-installation.png @path %})

1. In the pop-up window, complete the instructions to create a Sentry app within GitLab. Once you’re finished, click **Next**.

    [{% asset gitlab/configuration-modal.png alt="Configuration modal and Sentry app within GitLab" %}]({% asset gitlab/configuration-modal.png @path %})

1. Fill out the resulting GitLab Configuration form with the following information:

    1. The GitLab URL is the base URL for your GitLab instance. If using gitlab.com, enter https://gitlab.com/.

    1. Find the GitLab Group Path in your group’s GitLab page.

        [{% asset gitlab/gitlab-groups.png alt="GitLab page showing group path" %}]({% asset gitlab/gitlab-groups.png @path %})

    1. Find the GitLab Application ID and Secret in the Sentry app within GitLab.

        [{% asset gitlab/gitlab-app-id.png alt="GitLab application id and secret" %}]({% asset gitlab/gitlab-app-id.png @path %})

    1. Use this information to fill out the GitLab Configuration and click **Submit**.
    
        [{% asset gitlab/gitlab-configuration.png alt="GitLab configuration form" %}]({% asset gitlab/gitlab-configuration.png @path %})

1. In the resulting panel, click **Authorize**.

1. In Sentry, return to Organization Settings > **Integrations**. You’ll see a new instance of GitLab underneath the list of integrations.

1. Next to your GitLab Instance, click **Configure**. _Note: It’s important to configure to receive the full benefits of commit tracking._

    [{% asset gitlab/configure-gitlab-instance.png alt="GitLab instance with connected group and highlighted configure button" %}]({% asset gitlab/configure-gitlab-instance.png @path %})

1. On the resulting page, click **Add Repository** to select which repositories you’d like to begin tracking commits.

    [{% asset gitlab/add-repo.png alt="Add repository" %}]({% asset gitlab/add-repo.png @path %})

## Issue Management
Issue tracking allows you to create GitLab issues from within Sentry and link Sentry issues to existing GitLab issues.

1. Select your issue

    [{% asset gitlab/sentry-unresolved-issues.png alt="List of unresolved issues" %}]({% asset gitlab/sentry-unresolved-issues.png @path %})

1. Navigate to Linked Issues on the right panel of the issue's page and click **Link GitLab Issue**.
    
    [{% asset gitlab/linking-gitlab-issue.png alt="GitLab logo with Link GitLab Issue text" %}]({% asset gitlab/linking-gitlab-issue.png @path %}) 

1. You have two options to complete the issue link:

    1. In the pop-up, you can fill out the appropriate details in the _Create_ tab, and then click **Create Issue**.
    
        [{% asset gitlab/gitlab-create-issue.png alt="pop-up modal to create issue" %}]({% asset gitlab/gitlab-create-issue.png @path %})
    
    1. Or, in the pop-up, you can click the _Link_ tab, search the issue by name, and then click **Link Issue**. _Note: Issues aren't currently searchable by number._
    
        [{% asset gitlab/link-issue-by-name.png alt="pop-up modal to search issue name" %}]({% asset gitlab/link-issue-by-name.png @path %})

1. To unlink an issue, click on the _X_ next to its name under Linked Issues

    [{% asset gitlab/unlink-issue.png alt="GitLab logo and project next to an X icon" %}]({% asset gitlab/unlink-issue.png @path %})
    
## Commit Tracking

Commit tracking allows you to hone in on problematic commits. With commit tracking, you can better isolate what went out and what might be problematic, in regards to your commits, by leveraging information from releases like tags and metadata.

[{% asset gitlab/last-commit-in-releases.png alt="Dashboard with last commit highlighted" %}]({% asset gitlab/last-commit-in-releases.png @path %}) 
        