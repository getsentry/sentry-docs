---
title: Handled VS Unhandled
sidebar_order: 3
---

Sentry is able to provide developers with deep insight on handled and unhandled issues by using a simple captureException or captureMessage option. The configuration of this is very straightforward because regardless if you want to handle an error or not, you will be notified if an event is triggered within your app sent to Sentry.

> **Note:** If you're using your own source code, follow [Capturing your first event](https://docs.sentry.io/error-reporting/quickstart/?platform=python) to introduce an error to your source code.

## Handled Errors

Handled Errors are generated runtime errors explicitly reported to Sentry though the SDk's captureException.

## captureException

1. In order to use the configuration option of captureException, you will need to import captureException

```python
   from sentry_sdk import capture_exception
```

2. Within the file `views.py` the option captureException was added in the function `HandledErrorView`.

![Import and Configure SDK]({% asset guides/integrate-backend/capture_exception.png @path %})

3. Once the app runs and to trigger a handled issue is as simple as clicking or going to this link
   `http://localhost:8000/handled`.

4. After the issue is triggered you can confirm by looking into your network tab and seeing an event_id produced by the issue.

5. You can search for the specific event by using event_id found within the network tab in your Issues' Stream. Once you are directed to the event, you can get the information needed to learn more about the issue.

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

## Unhandled Errors

Unhandled Errors are generated during runtime when an issue is not caught/handled.

1. Unlike handled errors, no extra configuration is needed to be implemented within your SDK to send unhandled issues to Sentry.

2. If your app is open, please go to the link or click `http://localhost:8000/unhandled`.

3. An unhandled issue will be triggered (which can be verified within your SDK).

4. Using the event_id or simply looking at the issues that came in recently, you can view the unhandled issue.

**Note** If an issue is handled there will be a tag that says `yes` or `no`. For unhandled issues, the tag will equal `no`. For handled issues, the tag will equal `yes`.

![Import and Configure SDK]({% asset guides/integrate-backend/error_with_all_tags.png @path %})

## Next

[Integrating Backend with the Frontend]({%- link _documentation/guides/tutorials/integrate-backend/adding-code.md -%})

---
