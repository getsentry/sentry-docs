---
title: Capturing Errors
sidebar_order: 3
---

Once initialized in your code, the Sentry SDK will capture various types of events and notify you about them in real-time, depending on the alert rules you've configured. With the Django up already running on your localhost, let's try them out.

> **Note:** If you're using your own source code, follow [Capturing your first event](https://docs.sentry.io/error-reporting/quickstart/?platform=python) to introduce an error to your source code.

## Unhandled Errors

The Sentry SDK will automatically capture and report any Unhandled Error that happens in your application runtime without any additional configuration or explicit handling. Generally, Unhandled Errors are errors the aren't caught by any except (or try/catch) clause.

1. In your browser, launch the local Django app in the following endpoint to trigger an unhandled error: `http://localhost:8000/unhandled`.

2. If you've set up an alert rule, you should be notified about the error. Otherwise, open the Issues view in your Sentry account.

3. Notice the unhandled exception appears in your _Issue Stream_.

   ![Unhandled Issue]({% asset guides/integrate-backend/unhandled_issue.png @path %})

4. Click on the issue, to open the issue details page.

   ![Issue Details Page]({% asset guides/integrate-backend/error_with_all_tags.png @path %})

5. Notice that the event is:

   * Tagged with the `Environment` and `Release` options we've set in the previous tutorial and `handled:no` - marking this event as an unhandled error.
   * Contains a _Suspect Commit_ enabled by the Commit Tracking feature we enabled in the previous tutorial.

## Handled Errors

The Sentry SDK contains various methods that you can utilize to **explicitly** report errors, events and custom messages in except clauses, critical areas of your code, etc.

### captureException

1. Open the `views.py` file. Notice  that we import `captureException` from the sentry_sdk lib.

   ```python
      from sentry_sdk import capture_exception
   ```

2. The method is utilized to capture the exception handled in by the except clause in `HandledErrorView`.

   ![Import and Configure SDK]({% asset guides/integrate-backend/capture_exception.png @path %})

3. To try it out, trigger the following endpoint on your localhost: `http://localhost:8000/handled`.

4. Similar to the unhandled error, open the new issue's detail page.

## captureMessage

1. Just like captureException, we will need to import captureMessage.

```python
   from sentry_sdk import capture_message
```

2. You can place the capture_message option anywhere within your app. For the sake of this example, we've added it to the same function, `HandledErrorView` and replaced `capture_exception`.

3. Once the app runs and to trigger a handled issue is as simple as clicking or going to this link
   `http://localhost:8000/handled`.

4. Within your issues stream, you can find the exact issue using the event_id generated (mentioned above).

![Import and Configure SDK]({% asset guides/integrate-backend/capture_message.png @path %})

**Note** Typically, `capture_message` is not emitted but there are times when a developer may want to add a simple message within their app for debugging purposes and `capture_message` is great for that.


## Next

[Integrating Backend with the Frontend]({%- link _documentation/guides/tutorials/integrate-backend/adding-code.md -%})

---
