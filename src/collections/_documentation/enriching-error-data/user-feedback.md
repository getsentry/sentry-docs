---
title: 'User Feedback'
sidebar_order: 3
---

Sentry provides the ability to collect additional feedback from the user upon hitting an error. This is primarily useful in situations where you might generally render a plain error page (the classic `500.html`). To collect the feedback, an embeddable JavaScript widget is available, which can then be shown on demand to your users.

The following pieces of information are requested and collected:

-   The user’s name
-   The user’s email address
-   A description of what happened

When feedback is collected, Sentry will pair it up with the original event giving you additional insights into issues. 

Below is an example of what the User Feedback widget could look like, depending on your customization.

[{% asset user_feedback_widget.png alt="An example of a user feedback widget with text boxes for user name, email, and additional details about the break." %}]({% asset user_feedback_widget.png @path %})

## Collecting Feedback

The integration process consists of running our JavaScript SDK (2.1 or newer), authenticating with your public DSN, and passing in the client-side generated Event ID:

{% include components/platform_content.html content_dir='user-feedback-example' %}

If you don't want to use Sentry's native widget, you can also send feedback using our [_User Feedback API_](/api/projects/post-project-user-reports/).

## Customizing the Widget

Several parameters are available to customize the widget, specifically for localization. All options can be passed through the `showReportDialog` call.

An override for Sentry’s automatic language detection (e.g. `lang=de`)

| Param | Default |
| --- | --- |
| `eventId` | Manually set the id of the event. |
| `dsn` | Manually set dsn to report to. |
| `user` | Manually set user data _[an object with keys listed above]_. |
| `user.email` | User's email address. |
| `user.name` | User's name. |
| `lang` | _[automatic]_ – **override for Sentry’s language code** |
| `title` | It looks like we’re having issues. |
| `subtitle` | Our team has been notified. |
| `subtitle2` | If you’d like to help, tell us what happened below. – **not visible on small screen resolutions** |
| `labelName` | Name |
| `labelEmail` | Email |
| `labelComments` | What happened? |
| `labelClose` | Close |
| `labelSubmit` | Submit |
| `errorGeneric` | An unknown error occurred while submitting your report. Please try again. |
| `errorFormEntry` | Some fields were invalid. Please correct the errors and try again. |
| `successMessage` | Your feedback has been sent. Thank you! |
| `onLoad` | n/a |
