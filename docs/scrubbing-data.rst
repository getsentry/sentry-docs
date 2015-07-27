Sensitive Data
==============

As with any third party service it's important to understand what data is being
sent to Sentry, and where relevant ensure sensitive data either never reaches
the Sentry servers, or at the very least it doesn't get stored. Our primary
approach to this problem is a pessimitic view: you accidentaly sent data to
Sentry and you either want to remove it, or you want to ensure it doesnt get
stored.


Prevention
----------

Within your project settings you'll find a "Data scrubber" option. By default
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

Some clients will also allow you to filter data ahead of time following similar
patterns.


Removing Data
-------------

If you've accidental sent sensitive data to the server it's likely you're not
going to want to leave it there. There's a few things to note in removal:

- If you've sent it as a tagged value, removing the event is not enough. You
  can visit Project Settings and under Tags you'll find a way to permanently
  remove any related data for a given tag.
- If you need to wipe just a single event, you'll find the ability to bulk
  delete all sampled events under a rollup by visiting the rollup details page
  and selecting "Remote Event Data".
- If you've set of sparse events to a project (potentially all of them), your
  only option is to remove the project and re-create it. Keep in mind this will
  revoke API credentials, so you likely want to do this in the reverse order.
