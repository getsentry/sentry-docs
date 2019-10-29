---
title: Capture your First Error
sidebar_order: 3
---

Now that the Demo App is up and running on your local environment integrated with the Sentry SDK, you're ready to generate the first error. 

> **Note:** If you're using your own source code, follow [Capturing your first event](https://docs.sentry.io/error-reporting/quickstart/?platform=browser) to introduce an error to your source code and continue with [Step 2](#step-2-handle-the-error)

## Step 1: Capture your First Event

1. Launch the demo app by opening the [localhost link](https://localhost:5000) in your browser 

2. Open the browser **Developers Console** to verify that an error is generated

    ![Import and Configure SDK]({% asset guides/integrate-frontend/generate-first-error-02.png @path %})

3. Click on any of the **Buy!** buttons to add products to your shopping cart

4. Click on the **Checkout** button on the left panel to generate an error

    ![Import and Configure SDK]({% asset guides/integrate-frontend/generate-first-error-01.png @path %})

    Notice that:
    * An error message **Something went wrong** displays in the app 
    * The error stack trace shows in the browser console
    * An alert sent to your email address configured on Sentry.io notifying you about an error that occurred in your app

        ![Import and Configure SDK]({% asset guides/integrate-frontend/generate-first-error-03.png @path %})

***

## Step 2: Handle the Error

1. Go to your email Inbox and open the email notification from Sentry

    ![Import and Configure SDK]({% asset guides/integrate-frontend/generate-first-error-04.png @path %})

2. Click on `View on Sentry` to view the full details and context of this error in your Sentry account

3. Open the `Event` in the `Issue` details page

    ![Import and Configure SDK]({% asset guides/integrate-frontend/generate-first-error-05.png @path %})
    > **Note:** Sentry aggregates similar errors (events) into one Issue

4. Scroll down to the `Exception` stack trace

    ![Error Stack-trace]({% asset guides/integrate-frontend/generate-first-error-06.png @path %})

    > * Notice that the stack trace is **minified**. This is usually the case with JavaScript code in a production environment.
    > * Sentry can un-minify the code back to its readable form and display source (code) context lines in the stack frames. We will configure that in the next tutorial.

***

## Step 3: Create New Alerts

You can create various alert rules per project and let Sentry know when, how, and who you want notified when errors occur in your application. **Alert rules** consist of **Conditions** and **Actions** which are performed once the associated conditions are met. For more information, see [Alerts](https://docs.sentry.io/workflow/notifications/alerts/).

By default, each project is created with one initial alert rule, notifying all project team members (via email) the first time a new **issue** appears. This means that the next time the Checkout **error** occurs, you will not be notified about it.

In this step, you will create a new Alert rule notifying **every time** an event occurs even if it's associated with an already existing **issue**.

 1. Click on the **cog icon** next to the project name to open the `Project Settings`

    ![Open Project Settings]({% asset guides/integrate-frontend/generate-first-error-07.png @path %})

2. Click on `Alerts` to open the Alerts Configuration page
    > Notice the default alert rule already defined in your project

3. Click on `New Alert Rule`

    ![Alerts Configuration]({% asset guides/integrate-frontend/generate-first-error-08.png @path %})

4. In the New Alert Rule form, enter the following values 

    ![New Alert Rule form]({% asset guides/integrate-frontend/generate-first-error-09.png @path %})

    > The new alert rule will notify you every time _an event is seen_ in _All Environments_ via _Mail_

5. Click `Save Rule` to create the new rule

6. To test the new rule, reproduce the error in the demo app 

***

## Next

[Enable Readable Stack Traces in your Errors]({%- link _documentation/guides/integrate-frontend/upload-source-maps.md -%})
