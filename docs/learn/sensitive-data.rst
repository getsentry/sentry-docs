Filtering Data
==============

As with any third party service it's important to understand what data is being
sent to Sentry, and where relevant ensure sensitive data either never reaches
the Sentry servers, or at the very least it doesn't get stored. Our primary
approach to this problem is a pessimitic view: you accidentaly sent data to
Sentry and you either want to remove it, or you want to ensure it doesnt get
stored.


Server-Side Filtering
---------------------

Within your project settings you'll find a **Data Scrubber** option. By default
this is enabled, and we highly recommend you keep it that way. With it enabled
Sentry will scrub the following:

- Values that look like they contain credit cards (using a basic regular
  expression)

- Keys that contain any of the following values:

  - password

  - secret

  - passwd

  - authorization

  - api_key

  - apikey

  - access_token

- Any keys which match values that you've added to the list of additional fields
  in your Project Settings.

You can choose to expand the keys which are scrubbed by the server, as well as
prevent IP addresses from being stored. The latter is particularly important if
you're concerned about PII and using our Browser JavaScript SDK.

Additionally some SDKs will also allow you to filter data ahead of time following
similar patterns.


Restricting Emails
------------------

It's common that compliance within your company may mean that data can only be
transmitted over SSL and stored in a secure manner. One common area this comes
up is with email notifications. By default Sentry will send a large amount of
data as part of the issue notification. In some cases this data may be source
code or other user data.

To work around this problem you can enable the **Enhanced Privacy** setting
in your organization. This can be done by visiting the organization's dashboard,
clicking **Settings**, and then ticking the option there. Once done parts of the
system, primarily email notifications, will immediately reflect this change and
begin restricting data to only basic attributes such as the issue title and
description.


Removing Data
-------------

If you've accidentally sent sensitive data to the server it's likely you're not
going to want to leave it there. There are a few things to note in removal:

- If you've sent it as a tagged value, removing the event is not enough. You
  can visit Project Settings and under Tags you'll find a way to permanently
  remove any related data for a given tag.

- If you need to wipe just a single event, you'll find the ability to bulk
  delete all sampled events under a rollup by visiting the rollup details page
  and selecting "Remove Event Data".

- If you've set of sparse events to a project (potentially all of them), your
  only option is to remove the project and re-create it. Keep in mind this will
  revoke API credentials, so you likely want to do this in the reverse order.
