---
title: Create a New Project
sidebar_order: 1
---

In this tutorial, you create a new `Project` in your Sentry account. Projects allow you to scope events to a distinct application in your organization and assign responsibility and ownership to specific users and teams within your organization. You can create a project for a particular language or framework used in your application. For example, you might have separate projects for your API server and frontend client.

___

## Let's Go

1. Login to your [Sentry organization](https://sentry.io)

2. Select `Projects` from the left side navigation menu to display the list of all your projects

3. Click on the `+ Create Project` button

    ![Create new project]({% asset guides/integrate-frontend/create-new-project-01.png @path %})

    > **Note:** If there are no projects in your account --- you might be redirected to the onboarding wizard to create your first project. 

* Select the language or framework for your project based on the code you wish to monitor --- in this case, `JavaScript`.

* Give the project a `Name`.

    ![Select project language]({% asset guides/integrate-frontend/create-new-project-02.png @path %})

* `Assign a Team` to the project.
    > If you haven't defined any teams, you can either select the default org team (the team has the same name as your Sentry Org) or click on the `+` button to create a new team.

    ![Select team]({% asset guides/integrate-frontend/create-new-project-03.png @path %})

* Click on `Create Project`. 
    This takes you to the configuration page. Read through the quick Getting Started guide.

4. Copy the `DSN key` and keep it handy as we will be copying the key into the source code.

    ![Copy DSN]({% asset guides/integrate-frontend/create-new-project-04.png @path %})
    > The DSN (or Data Source Name) tells the SDK where to send the events, associating them with the project you just created. It consists of a few pieces, including the protocol, public key, server address, and project identifier, and has the following format:

    ```
    https://<Public Key>@<Sentry Server Address>/<Project Identifier>
    ```

5. Click on the `Got it!` button at the bottom to create the project. 

## Next

[Introduce Sentry SDK to your Frontend Code]({%- link _documentation/guides/integrate-frontend/initialize-sentry-sdk.md -%})
