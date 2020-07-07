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

Our newer SDKs do not purposefully send PII to stay on the safe side. This behavior is controlled by an option called [`send-default-pii`](/error-reporting/configuration/#send-default-pii -%}).

Turning this option on is required for certain features in Sentry to work, but also means you will need to be even more careful about what data is being sent to Sentry (using the options below).

## Custom Event Processing in the SDK

In the SDKs, you can configure a `before-send` function, which is invoked before an event is sent and can be used to modify the event data and remove sensitive information. Using `before-send` in the SDKs to **scrub any data before it is sent** is the recommended scrubbing approach, as SD never leaves the local environment.

```javascript
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  beforeSend(event) {
    // Modify the event here
    if (event.user) {
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});
```

- Look out for SD **in event information** (stack trace, breadcrumbs, and other values the SDK is picking up such as headers/etc.) Some things to look out for:
    - Stack-locals → some SDKs (Python + PHP), will pick up variable values. This can be scrubbed or disabled altogether, if necessary
    - Breadcrumbs → some SDKs (for example, JavaScript, Java logging integrations) will pick up previously executed log statements. **Do not log PII** if using this feature and including log statements as breadcrumbs in the event. Some backend SDKs will surface DB queries which may need to be scrubbed
- Be **aware** of what is being attached to the event and **code review SDK changes,** including context carefully
    - Context → Tags (including User-context) + extra-info + breadcrumbs

For more details, see [_Filtering Events_](/error-reporting/configuration/filtering/).

### Examples

- Attaching PII/SD

    Don't do:
    
    ```javascript
    Sentry.setTag('birthday', '08/03/1990');
    ```
    
    Instead, anonymize (by using `checksum`, `hash`, etc.):
    
    ```javascript
    Sentry.setTag('birthday', checksum_or_hash('08/12/1990'));
    ```
    
- Attaching user/email information (if it is considered SD or not permitted)

    Don't do:
    
    ```javascript
    Sentry.setUser({email: user.email});
    ```    

    Instead, anonymize (use `id`, `username`, etc.):
    
    ```javascript
    Sentry.setUser({id: user.id});
    
    // or
    
    Sentry.setUser({username: user.username});
    ```

- Logging PII/SD (if using breadcrumbs, include console/log statements)

    Don't do:
    
    ```javascript
    console.log("user's name is: " + user.name);
    ```
    
    Instead:
    
    ```
    // 1. don't log SD/PII
    // 2. use `beforeBreadcrumb` to filter it out from breadcrumbs before it is attached
    // 3. Disable logging breadcrumb integration (e.g. <https://docs.sentry.io/platforms/javascript/?platform=browser#breadcrumbs-1>)
    ```

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

### Advanced server-side data scrubbing

We are currently betatesting additional features around server-side data scrubbing. For more information see [_Advanced Data Scrubbing_](/data-management/advanced-datascrubbing/).

## Restricting Emails

It’s common that compliance within your company may mean that data can only be transmitted over SSL and stored in a secure manner. One common area this comes up is with email notifications. By default Sentry will send a large amount of data as part of the issue notification. In some cases this data may be source code or other user data.

To work around this problem you can enable the **Enhanced Privacy** setting in your organization. This can be done by visiting the organization’s dashboard, clicking **Settings**, and then ticking the option there. Once done parts of the system, primarily email notifications, will immediately reflect this change and begin restricting data to only basic attributes such as the issue title and description.

## Removing Data

If you’ve accidentally sent sensitive data to the server it’s likely you’re not going to want to leave it there. There are a few things to note in removal:

-   If you send it as a tagged value, removing the event is not enough. You can visit Project Settings and under Tags you’ll find a way to permanently remove any related data for a given tag.
-   If you need to wipe just a single event, you’ll find the ability to bulk delete all sampled events under a rollup by visiting the rollup details page and selecting “Delete”.
-   If you send sparse events to a project (potentially all of them), your only option is to remove the project and re-create it. Keep in mind this will revoke API credentials, so you likely want to do this in the reverse order.

