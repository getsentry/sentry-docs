---
title: Event Grouping Rules
sidebar_order: 0
---

## What makes Sentry Events group together into an Issue? 
Have you ever had something like the image below?
![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issues-dashboard.png @path %})

Let's first understand why *testTypeIssue15* has 4 Events which grouped into 1 Issue. These events shared the same value for something called the `fingerprint`

**What is a fingerprint?** It is a way to uniquely identify an event in Sentry. It is set by default using a hash of the stacktrace, which is the default grouping algorithm. If 2 events have the same stacktrace and the default grouping is left in place, then they group together into 1 Issue.

**Do I need to do anything?** No. Only if you have separate issues that you'd like to group together, which is what the rest of this Guide will cover. Otherwise, the default grouping behavior (stacktrace) will stay in place.

**How do I see the fingerprint?** If you're really curious then open an issue , click the JSON link, and find the `fingerprint` property. If the default grouping was used, you'll see 'default' written there. If different grouping was used, you'll see the actual fingerprint value itself.

## Why are similar looking Issues not grouping together?
While everything that meets the eye in the Issues dashboard looks similar, there is something that still differs: the stacktrace, and therefore the fingerprint. Let's compare two similar looking issues side-by-side:

![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issue-stacktraces-comparison.png @path %})

Notice the only difference is one had function *testTypeIssue15* and the other had *testTypeIssue14*. This means the stacktraces are not identical.

Sometimes one stacktrace has extra frames even though it's roughly the same execution path in your app, or same end result. This can be due to a number of things, like middleware you've configured, node_modules or library imports. To have greater control over what gets included or excluded, see [Custom Grouping Enhancements](https://docs.sentry.io/data-management/event-grouping/grouping-enhancements/).

{% capture __alert_content -%}
Fortunately, we can change the default grouping behavior to make certain issue types match on something other than stacktrace, from both the **SDK side** and the **Server side**.
{%- endcapture -%}
{%- include components/alert.html
    title="INFO"
    content=__alert_content
    level="warning"
%}

# Solutions
There are three different approaches you can take for the similar looking issues in your dashboard. You can merge together the issues already there. We'll call this **Merging Similar Issues**. Or,you can set rules so that the next incoming issues will get grouped together.  We'll call this **Server-side Fingerprinting**. There is also **SDK Side Fingerprinting**. More on that [here](https://docs.sentry.io/data-management/event-grouping/sdk-fingerprinting/?platform=javascript). The difference between SDK side and Server side are the data elements on the exception and stacktraces which you can use for matching issues.

In **Merging Similar Issues** we'll see how historical issues can be merged together. No settings or configuration required to do this.

In **Server-side Fingerprinting** we'll see how to set rules for new incoming issues of our choice to get grouped together by. This will not affect historical issues.

## Merging Similar Issues
This is for merging similar issues and will not auto merge the next occurance of this issue coming in.

Before merge  
![Before Merge]({% asset guides/grouping-and-fingerprints/before-merge.png @path %})

After merge, we see that *testTypeIssue7* and *testTypeIssue* were merged together.
![After Merge]({% asset guides/grouping-and-fingerprints/after-merge.png @path %})

You can also do this from inside a single issue. Click the Similar Issues tab  
![Similar Issues]({% asset guides/grouping-and-fingerprints/similar-issues.png @path %})

{% capture __alert_content -%}
Future issues will get added to the merged set only if they match one of the stacktraces in the merged set
{%- endcapture -%}
{%- include components/alert.html
    title="INFO"
    content=__alert_content
    level="warning"
%}

## Server-side Fingerprinting

Here's an overview of what we'll do using **Server-Side Fingerprinting**
1. Identify several issues that you'd like to see merged together into 1. 
2. Identify the match logic for grouping issues together by (e.g. type of the exception)
3. Set the match logic and its fingerprint for it, in your Project Settings.


### 1. Identify Issues for Merging

Let's say you want the following two issues merged together because they both are OperationalErrors and contain "could not translate host name" but it doesn't matter to you whether it's to the "company-shared" or "company-production" environment.

IMAGE...of two of these OperationErrors

### 2. Identify the Match Logic
Here's how to set the match based on the error.type  
(TODO screenshot, where in UI to do this?)
```
type:OperationalError -> operational-error-type
```

Now, all events coming in with OperationalError will get a fingerprint of operational-error-type and will get grouped under the same 1 issue. This only applies to future events coming in. Each event for this 1 issue might have a different stacktrace, but we're no longer using stacktrace as the default grouping rule. Instead, we are using
`type:OperationalError`

### 3. Set The Match Logic and Fingerprint
The syntax for this is `type:value -> fingerprint` which you specify as a rule in your project's settings.
SCREENSHOT...

Here's how to set the match using a regex on the error.value:
OR SCREENSHOT...
`value:"could not translate host name*" -> operational-error-type`

You could also do this based on the path or the function, see [additional examples](https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/#examples)

Here's an overview of how to do this using **SDK Side Fingerprinting**, see [SDK Fingerprinting](https://docs.sentry.io/data-management/event-grouping/sdk-fingerprinting/?platform=javascript) which involves updating code on your end. I can work with you on this.
