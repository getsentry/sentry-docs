---
title: Integrate your Source Code Repository
sidebar_order: 5
---

Now that you created a release, the next step is to integrate your GitHub repository. Sentry uses the repository metadata to help you resolve your issues faster. 


## Description & Objectives
You can tell Sentry which commits are associated with your release --- this is called **Commit Tracking**. 
This allows Sentry to display:
- **Suspect Commits** - commits which likely caused the issue, with a link to the commit itself.
- **Suggested Assignees** - lists the authors of those commits and suggests their assignment to resolve the issue.

In this part, you will:
- Integrate your Sentry organization with your GitHub account and repository --- this gives Sentry access to your commit metadata.
- Set up commit tracking. In your release process, after creating the release object in Sentry, associate it with commits from your linked repository.

## Step 1: Integrate your GitHub Account & Repositories 

1. To integrate GitHub with your Sentry org, follow the instructions in the [Global Integrations documentation](https://docs.sentry.io/workflow/integrations/global-integrations/#github)

2. For the last step, add the `sentry-react-demo` repository from your GitHub account

    ![Add project repository]({% asset guides/integrate-frontend/configure-scms-01.png @path %})

GitHub should now be enabled and available for all projects in your Sentry organization.


## Step 2: Set Up Commit Tracking

In the demo project, we use a Makefile to handle our build-related tasks. 
> **Note:** If you are not using the using the provided React demo code and do not have a Makefile, you could optionally run the `sentry-cli` commands used in this tutorial directly from the `command line` or integrate the commands into the relevant build script.

1. Open the `Makefile` in your project 

2. Add the following target at the bottom of the file:

    ```Shell
    associate_commits:
        sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(REACT_APP_RELEASE_VERSION)
    ```
    > The command associates commits with the release. The **--auto** flag automatically determines the repository name, and associates commits between the previous release’s commit and the current head commit with the release.

3. The new target `associate_commits` will be invoked as part of the `setup_release` target, add it at the end:

    ``` Shell
    setup_release: create_release upload_sourcemaps associate_commits
    ```

    Your Makefile should look like this:

    ![Updated Makefile]({% asset guides/integrate-frontend/configure-scms-02.png @path %})

4. If your terminal is still serving the demo app on localhost, press `^C` to shut it down

5.  Build, deploy, and rerun the project by running:
     ```
    $ npm run deploy
    ```
    In the terminal log, notice that the sentry-cli identified the GitHub repository. 

    ![Updated Makefile]({% asset guides/integrate-frontend/configure-scms-03.png @path %})


## Step 3: Suspect Commits and Suggested Assignees

Now suspect commits and suggested assignees should start appearing on the issue page. We determine these by tying together the commits in the release, files touched by those commits, files observed in the stack trace, authors of those files, and ownership rules.

1. Refresh the browser and generate an error by adding products to your cart and clicking **Checkout**

2. Check your Email for the alert about the new error and click **View on Sentry** to open the issue page

3. In the main panel, notice the `SUSPECT COMMITS` section now points to a commit that most likely introduced the error. You can click on the commit button to see the actual commit details on GitHub

4. In the right-side panel, under `Suggested Assignees` --- you'll see that the author of the suspect commit is listed as a suggested assignee for this issue

    ![Updated Makefile]({% asset guides/integrate-frontend/configure-scms-04.png @path %})

    > You can assign the suggested assignee to the issue by clicking on the icon. However, in this case, the commit originates in the repository upstream, and the suggested assignee is not part of your organization.
    > Alternatively, you can manually assign the issue to other users or teams assigned to the project.

5. Click on the `ASSIGNEE` dropdown and select one of the project users or teams

    ![Suspect Commit]({% asset guides/integrate-frontend/configure-scms-05.png @path %})


6. From the main panel, find the `release` tag and **hover over** the `i` icon

7. In the release popup, notice the release now contains the commit data

    ![Assign Manually]({% asset guides/integrate-frontend/configure-scms-06.png @path %})

8. **Click** on the release `i` icon to open the release details page

9. Select the `Commits` tab. Notice that release now contains the associated list of commits

    ![Updated Makefile]({% asset guides/integrate-frontend/configure-scms-07.png @path %})



## More Information 
- [Create Release and Associate Commits](https://docs.sentry.io/workflow/releases/?platform=javascript#create-release)
- [Global Integrations](https://docs.sentry.io/workflow/integrations/global-integrations/)
