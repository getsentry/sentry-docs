---
title: Issue Grouping and Setting the Fingerprint
sidebar_order: 0
---

Blah blah blah.  Description and overview paragraph.


## Grouping Issues
historical/existing. will not update future/next issues coming in.

the existing options in the Sentry.io UI that you can use for grouping issues that have already come in. I'll send out a second email with instructions on how you can change the configuration itself, which is more involved.

Before merge  
![Before Merge]({% asset guides/grouping-and-fingerprints/before-merge.png @path %})

After merge  
![After Merge]({% asset guides/grouping-and-fingerprints/after-merge.png @path %})

You can also do this from inside a single issue. Click the Similar Issues tab  
![Similar Issues]({% asset guides/grouping-and-fingerprints/similar-issues.png @path %})


## Why Don't Group
here's an overview of why a given set of results is not grouping together.
IMAGE4 of a bunch of similar looking issues,that should be merged. customer.
The issues do not have the same stack traces - this is why they're not grouping together. The stack trace is by default used to generate something called the [fingerprint](https://docs.sentry.io/data-management/event-grouping/) and the issues need to share the same fingerprint in order to group together. However, we can change the default grouping behavior to make them match on something other than stacktrace.

### Steps
1. Pick several issues that you'd like to see merged together into 1. 
2. Identify something to match them together by (e.g. they share the same Error Type, Error Value, Function or Path)
3. Set a rule for the fingerprint. The syntax for this is type:value -> fingerprint which you specify as a rule in your project's settings.
4. documentation - https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/
5. You can set the fingerprint on both the server-side and the client-side

## Examples
### Server-Side Fingerprinting
Manually set your own fingerprint based on the match, using [Server-Side Fingerprinting](https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/).

Let's say you want the following two issues merged together because they both are OperationalErrors and contain "could not translate host name" but it doesn't matter to you whether it's to the "company-shared" or "company-production" environment.

IMAGE...of two of these OperationErrors

Here's how to set the match based on the error.type
`type:OperationalError -> operational-error-type`

Now, all events coming in with OperationalError will get force assigned a fingerprint of operational-error-type and will get grouped under the same 1 Issue. This only applies to future events coming in. Each event for this 1 Issue might have a different stacktrace, but we're no longer using stacktrace as the default grouping rule. Instead, we are using `type:OperationalError`.

Here's how to set the match using a regex on the error.value:
`value:"could not translate host name*" -> operational-error-type`

You could also do this based on the path or the function
[additional examples](https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/#examples)


### Client-Side Fingerprinting (SDK)
Lastly, you can update the fingerprint on the Client-Side using [SDK Fingerprinting](https://docs.sentry.io/data-management/event-grouping/sdk-fingerprinting/?platform=javascript) which involves updating code on your end. I can work with you on this.