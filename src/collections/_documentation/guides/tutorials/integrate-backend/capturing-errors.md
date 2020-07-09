---
title: Capturing Errors
sidebar_order: 3
---

Once initialized in your code, the Sentry SDK will capture various types of events and notify you about them in real-time, depending on the alert rules you've configured. With the Django app already running on your [localhost](http://localhost:8000/), let's try them out.

> **Note:** If you're using your own source code, follow [Capturing your first event](https://docs.sentry.io/error-reporting/quickstart/?platform=python) to introduce an error into your app.

## Unhandled Errors

The Sentry SDK will automatically capture and report any Unhandled Error that happens in your application runtime without any additional configuration or explicit handling. Generally, Unhandled Errors are errors the aren't caught by any except (or try/catch) clause.

1. In your browser, launch the local Django app in the following endpoint to trigger an unhandled error: `http://localhost:8000/unhandled`.

2. If you've set up an alert rule, you should be notified about the error. Otherwise, open the `Issues` view in your Sentry account.

3. Notice the unhandled exception appears in your _Issues Stream_.

   ![Unhandled Issue]({% asset guides/integrate-backend/unhandled_issue.png @path %})

4. Click on the issue, to open the issue details page.

   ![Issue Details Page]({% asset guides/integrate-backend/error_with_all_tags.png @path %})

5. Notice that the event:

   - Is tagged with the `environment` and `release` options we've set in the previous tutorial and `handled:no` - marking this event as an unhandled error.
   - Contains a `Suspect Commit` enabled by the commit tracking feature we enabled previously.
   - Contains the custom breadcrumb we added through the SDK.

      ![Unhandled Breadcrumbs]({% asset guides/integrate-backend/unhandled_issue_breadcrumbs.png @path %})

## Handled Errors

The Sentry SDK contains several methods that you can utilize to **explicitly** report errors, events and custom messages in except clauses, critical areas of your code, etc.

### Capture Exception

1. Open the `views.py` file. Notice that we import `sentry_sdk` lib which contains the `capture_exception` method

   ```python
      import sentry_sdk
   ```

2. The method is utilized to capture the exception handled by the except clause in `HandledErrorView`.

   ![Import and Configure SDK]({% asset guides/integrate-backend/capture_exception.png @path %})

3. To try it out on your localhost, trigger the following endpoint: `http://localhost:8000/handled`.

4. Similar to the unhandled error, open the new issue's detail page.

5. Notice that the event is tagged with the same `environment` and `release` configuration options. Hover over the `i` icon in the release tag to reveal the release information and the commits associated with it.

   ![Handled release]({% asset guides/integrate-backend/handled_release.png @path %})

6. Click on the release's `i` icon to navigate to the release page.

### Capture Message

Typically, `capture_message` is not emitted but there are times when a developer may want to add a simple message within their app for debugging purposes and `capture_message` is great for that.

1. In the `views.py` file, the `capture_message` method is made available through the `sentry_sdk` lib import.

2. You can use it anywhere within your app. In our example, we've created a dedicated view class `CaptureMessageView` to trigger and capture a message we want to track

   ```Python
      sentry_sdk.capture_message("You caught me!")
   ```

3. To try it out on your localhost, trigger the following endpoint: `http://localhost:8000/message`.

4. As before, open the new issue’s detail page from your _Issues Stream_.

   ![Import and Configure SDK]({% asset guides/integrate-backend/capture_message.png @path %})

   > By default captured messages are marked with a severity level tag `level:info` as reflected in the tags section. However, the `capture_message` methods accept an **optional** severity level parameter with possible values as described [here](https://docs.sentry.io/enriching-error-data/additional-data/?platform=python#setting-the-level).

5. In the `views.py` file, go ahead and change the `capture_message` method to:

   ```Python
      sentry_sdk.capture_message("You caught me!", "fatal")
   ```

6. Save the changes and trigger the `/message` endpoint again. (Changes should be applied immediately through `StateReloader`)

7. Notice that the severity level tag on the new event now shows `level:fatal`.

## Next

[Integrating Backend with Frontend]({%- link _documentation/guides/tutorials/integrate-backend/adding-code.md -%})
