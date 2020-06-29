---
title: Configuration Options
sidebar_order: 2
---

Sentry has many configurations options to help enhance your experience using Sentry. The options can help provide additional data needed to debug issues even faster or help control what is sent to Sentry by filtering.

> **Note:** View the full list of configuration options [here](https://docs.sentry.io/error-reporting/configuration/?platform=python).

## Releases

A `release` is a version of your code that is deployed to an environment. Releases are great when figuring out if there is a regression in your code, holding accountability, resolving issues within Sentry, and staying up to date with your deployments. Releases need to be set up within your SDK and if you want extra features such as suspect commits and suggested assignee, you can integrate your repo with Sentry. Sentry currently supports integrations with GitHub, BitBucket, Azure DevOps, GitLab, and many others. For a complete list of our integrations, check out our docs on [Integrations](https://docs.sentry.io/workflow/integrations/global-integrations/)

1. In the file `settings.py` within the initial setup of Sentry, add the configuration option `release` and set it to a value of your choice.

> If you are not interested in connecting Sentry's releases to an integration, you can skip the following steps.

2. The value assigned to the release within the `Django-demo` app is `os.environ.get("VERSION")`.

3. Now that the release is set within the SDK, using [sentry-cli](https://docs.sentry.io/cli/) we can connect our repo with our app. Using the `Makefile` we first create the release
   > `$(VERSION)` refers to the release's ID
   ```bash
   > create_release:
   		sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(VERSION)
   ```
4. To associate commits, using the created release from above, we are able to use the `$(VERSION)` and use our repo to associate the commits.
   ```bash
   > associate_commits:
   		sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) \
   			set-commits $(VERSION) --commit "$(REPO)@$(VERSION)"
   ```
   ![Import and Configure SDK]({% asset guides/integrate-backend/makefile.png @path %})

## Breadcrumbs

`Breadcrumbs` are a trail of events which led to the issue. Breadcrumbs are very helpful in reproducing issues. Since breadcrumbs are the events that led to the error, you can follow the trail of events to reproduce the issue. For more information, see [Breadcrumbs](https://docs.sentry.io/enriching-error-data/breadcrumbs/?platform=python).

In this part, we'll add breadcrumbs to our app.

1. Import breadCrumbs to the app.

   ```python
   from sentry_sdk import add_breadcrumb
   ```

2. Add the `add_breadcrumb` to any function you wish to add it to but for our example, we are going add it to the `process_order` function found in `views.py`.

   ![Import and Configure SDK]({% asset guides/integrate-backend/breadcrumbs.png @path %})

3. Since these are custom breadcrumbs, you can customize the details you want to add to the breadcrumb.
   `Category` is defined to be the event label on how you want to categorize it. You can categorize it to be `auth` or anything meaningful to you. `Level` allows you to know how severe the issue is. The level can be set to `error, fatal, warning, info or debug`. `Message` is a string you can pass in to help describe the event.

## Environment

`Environment` is a powerful configuration that enables developers using Sentry to filter issues, releases, and user feedback within the Issues Details page in the U/I. Sometimes there might be cases where you are focused on a particular environment and want to see issues related to that environment. Having the option to filter the environment, your workflow becomes a lot more clearer and the time it takes to debug issues you are focused on easier.

1. In the `views.py` file, in the initialization of (`sentry_sdk.init()`), add the configuration option `environment`.

2. Set the `environment` variable to any value you feel is appropriate. In our example, I've set it to `Production` indicating the issue occurred within the production.

   ```python
    environment:"Production"
   ```

   **Note** you can set your environment to any environment and it does not have to be hardcoded.

## Next

[Handled vs Unhandled Errors]({%- link _documentation/guides/tutorials/integrate-backend/handled_vs_unhandled.md -%})
