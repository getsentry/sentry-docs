---
title: 'Sensitive Data'
sidebar_order: 1
keywords: ["pii", "gdpr", "personally identifiable data", "compliance"]
---

As with any third-party service it’s important to understand what data is being sent to Sentry, and where relevant ensure sensitive data either never reaches the Sentry servers, or at the very least it doesn’t get stored. We recommend filtering or scrubbing sensitive data within the SDK, so that data is not sent with the event, and also configuring server-side scrubbing to ensure the data is not stored.

There are two great examples for data scrubbing that every company should think about:

- PII (Personally Identifiable Information) such as a user's name or email address, which post-GDPR should be on every company's mind
- Authentication credentials, like tokens and passwords

## Default PII

Our newer SDKs do not purposefully send PII to stay on the safe side. This behavior is controlled by an option called [`send-default-pii`]({%- link _documentation/error-reporting/configuration/index.md -%}#send-default-pii -%}).

Turning this option on is required for certain features in Sentry to work, but also means you will need to be even more careful about what data is being sent to Sentry (using the options below).

## Custom Event Processing in the SDK

In the SDKs you can configure a `before-send` function which is invoked before an event is sent and can be used to modify the event data and remove sensitive data. See [_Filtering Events_]({%- link _documentation/error-reporting/configuration/filtering.md -%}) for more information.

## Server-Side Scrubbing

Within your project settings you’ll find a **Data Scrubber** option. By default this is enabled, and we highly recommend you keep it that way. With it enabled, Sentry will scrub the following:

-   Values that look like they contain credit cards (using a basic regular expression)
-   Values that themselves contain, or whose keynames contain, any of the following strings: 
    -   password
    -   secret
    -   passwd
    -   api_key
    -   apikey
    -   access_token
    -   auth_token
    -   credentials
    -   mysql_pwd
    -   stripetoken
    -   card[number]
-   Any keys which match values that you’ve added to the list of additional fields in your Project Settings.

Sentry will redact arrays and literal values, but not entire objects. For example:

```bash
credentials = {
  username: 'jane',
  cats: ['pancake', 'maple', 'hellboy']
  password: 'p4ssw0rd!',
  lastLogin: 'yesterday',
  ...
}
```

using the default options would not cause the _object_ `credentials` to be redacted in its entirety; rather, all of its entries would be subject to scrubbing. So `password` would be redacted by default, and adding `cats`, `username`, and/or `lastLogin` to the list of additional fields would cause those values to be redacted as well. 

You can choose to expand the keys which are scrubbed by the server, as well as prevent IP addresses from being stored. The latter is particularly important if you’re concerned about PII and using our Browser JavaScript SDK.

As mentioned earlier, configure scrubbing within SDK if possible so that sensitive data is not sent with the request.

## Restricting Emails

It’s common that compliance within your company may mean that data can only be transmitted over SSL and stored in a secure manner. One common area this comes up is with email notifications. By default Sentry will send a large amount of data as part of the issue notification. In some cases this data may be source code or other user data.

To work around this problem you can enable the **Enhanced Privacy** setting in your organization. This can be done by visiting the organization’s dashboard, clicking **Settings**, and then ticking the option there. Once done parts of the system, primarily email notifications, will immediately reflect this change and begin restricting data to only basic attributes such as the issue title and description.

## Removing Data

If you’ve accidentally sent sensitive data to the server it’s likely you’re not going to want to leave it there. There are a few things to note in removal:

-   If you send it as a tagged value, removing the event is not enough. You can visit Project Settings and under Tags you’ll find a way to permanently remove any related data for a given tag.
-   If you need to wipe just a single event, you’ll find the ability to bulk delete all sampled events under a rollup by visiting the rollup details page and selecting “Delete”.
-   If you send sparse events to a project (potentially all of them), your only option is to remove the project and re-create it. Keep in mind this will revoke API credentials, so you likely want to do this in the reverse order.
