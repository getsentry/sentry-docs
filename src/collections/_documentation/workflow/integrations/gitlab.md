---
title: GitLab
sidebar_order: 6
---

Sentry’s new GitLab integration helps you find and fix bugs faster by using data from your GitLab commits. Additionally, you can streamline your triaging process by creating a GitLab issue directly from Sentry. _Note: this feature is currently available for Early Adopters. You can become an Early Adopter by navigating to your Organization Settings > General Settings._

## Configure GitLab

1. In Sentry, navigate to Organization Settings > Integrations. _Note: only users with Owner and Manager permissions have access._

1. Within Integrations, find the GitLab icon and click ‘Install.’

    {% asset gitlab/integration-pg.png alt="Sentry integrations page showing GitLab integration icon and install button." %}

1. In the resulting modal, click ‘Add Installation.’

    {% asset gitlab/add-installation.png alt="Sentry integrations page showing GitLab integration and how to connect Sentry to a GitLab instance." %}

1. In the pop-up window, complete the instructions to create a Sentry app within GitLab. Once you’re finished, click ‘Next.’

    {% asset gitlab/configuration-modal.png alt="Sentry integrations page showing GitLab configuration modal and Sentry app within GitLab." %}

1. Fill out the resulting GitLab Configuration form with the following information:

    1. The GitLab URL is the base URL for your GitLab instance. If using gitlab.com, enter https://gitlab.com/

    1. Find the GitLab Group Path in your group’s GitLab page.

        {% asset gitlab/gitlab-groups.png alt="GitLab group's page showing group path." %}

    1. Find the GitLab Application ID and Secret in the Sentry app within GitLab.

        {% asset gitlab/gitlab-app-id.png alt="GitLab application id and secret in Sentry app within GitLab." %}

    1. Use this information to fill out the GitLab Configuration and click ‘Submit.’gitlab

        {% asset gitlab/gitlab-configuration.png alt="GitLab configuration form." %}

1. In the resulting panel, click ‘Authorize.’

1. In Sentry, return to Organization Settings > Integrations. You’ll see a new instance of GitLab underneath the list of integrations.

1. Next to your GitLab Instance, click ‘Configure.’ _Note: It’s important to configure to receive the full benefits of commit tracking._

    {% asset gitlab/configure-gitlab-instance.png alt="GitLab instance with connected group and highlighted configure button." %}

1. On the resulting page, click ‘Add Repository’ to select which repositories you’d like to begin tracking commits.

    {% asset gitlab/add-repo.png alt="GitLab instance with connected group and highlighted configure button." %}
