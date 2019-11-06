---
title: Issue Grouping and Setting the Fingerprint
sidebar_order: 0
---

Blah blah blah.  Description and overview paragraph.


## Grouping Issues
historical/existing. will not update future/next issues coming in.

the existing options in the Sentry.io UI that you can use for grouping issues that have already come in. I'll send out a second email with instructions on how you can change the configuration itself, which is more involved.

Before merge  
IMAGE1  
After merge  
IMAGE2  

You can also do this from inside a single issue. Click the Similar Issues tab  
IMAGE3  


## Why Don't Group
here's an overview of why a given set of results is not grouping together.
IMAGE4 of a bunch of similar looking issues,that should be merged. customer.
The issues do not have the same stack traces - this is why they're not grouping together. The stack trace is by default used to generate something called the fingerprint and the issues need to share the same fingerprint in order to group together. However, we can change the default grouping behavior to make them match on something other than stacktrace.

### Steps
1. Pick several issues that you'd like to see merged together into 1. 
2. Identify something to match them together by (e.g. they share the same Error Type, Error Value, Function or Path)
3. Set a rule for the fingerprint. The syntax for this is type:value -> fingerprint which you specify as a rule in your project's settings.
4. documentation - https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/
5. You can set the fingerprint on both the server-side and the client-side

## Examples
### Server-Side Fingerprinting
...


### Client-Side Fingerprinting (SDK)
...