---
title: Grouping & Fingerprints
sidebar_order: 0
---

Have you ever had a set of similar looking issues like this?
![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issues-dashboard.png @path %})

Let's first understand what makes Sentry Events group together into a single Sentry Issue before we compare multiple issues side by side. Let's take *testTypeIssue15* as an example which has 4 Events that grouped into 1 Issue. These events shared the same value for something called the `fingerprint`

**What is a fingerprint?** It is a way to uniquely identify an event in Sentry. It is set by default using a hash of the stack trace. This is also referred to as the default grouping algorithm. If 2 events have the same stack trace and the default grouping is left in place, then they group together into 1 issue.

**Do I need to do anything?** No. Only if you have separate issues that you'd like to group together, which is what the rest of this Guide will cover. Otherwise, the default grouping behavior (stack trace) is used.

**How do I see the fingerprint?** If you're curious then open an issue, click the JSON link, and find the `fingerprint` property. If the default grouping was used, you'll see 'default' written there. If a different grouping was used, you'll see the actual fingerprint value itself.

## Why are similar looking Issues not grouping together?
While everything that meets the eye in the Issues Stream looks similar, there is something that still differs: the stack trace, and therefore the fingerprint. Let's compare two similar looking issues side-by-side:

![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issue-stacktraces-comparison.png @path %})

Notice the only difference is one had function *testTypeIssue15* and the other had *testTypeIssue14*. This means the stack traces are not identical.

Sometimes two stack traces are the same function execution path but differ by 1 frame. This can be due to a number of things like middleware you've configured, node_modules, the framework itself, or library imports. To have greater control over which stack frames are included or excluded, see [Custom Grouping Enhancements](https://docs.sentry.io/data-management/event-grouping/grouping-enhancements/).

{% capture __alert_content -%}
Fortunately you can change the default grouping behavior to make certain issue types match on something other than stack trace. You can do this from both the **Server side** and the **SDK side**
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

# Solutions
There are three different approaches you can take for similar looking issues in your dashboard. The first approach is for merging together the issues already created. We'll call this **Merging Similar Issues**. The second is for setting rules so next incoming issues will get grouped together. We'll call this **Server-side Fingerprinting**. The third is **SDK Side Fingerprinting**. More on that [here](https://docs.sentry.io/data-management/event-grouping/sdk-fingerprinting/?platform=javascript). The difference between SDK side and Server side is the data elements on the exception and stack traces which you can use for matching issues.

In **Merging Similar Issues** we'll see how historical issues can be merged together. No settings or configuration are required to do this.

In **Server-side Fingerprinting** we'll see how to set rules for new incoming issues of our choice to get grouped together by. This will not affect historical issues.

## Merging Similar Issues
This is for merging similar issues and will not auto merge the next occurance of this issue coming in.

Before merge  
![Before Merge]({% asset guides/grouping-and-fingerprints/before-merge.png @path %})

After merge, we see that *testTypeIssue7* and *testTypeIssue8* were merged together.
![After Merge]({% asset guides/grouping-and-fingerprints/after-merge.png @path %})

You can also do this from inside a single issue. Click the Similar Issues tab  
![Similar Issues]({% asset guides/grouping-and-fingerprints/similar-issues.png @path %})

{% capture __alert_content -%}
Future issues will get added to the merged set only if they match one of the stack traces in the merged set
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

## Server-side Fingerprinting

Here's an overview of what we'll do using **Server-Side Fingerprinting**
1. Identify the match logic for grouping issues together. We'll use either the error's **type** or **message**
2. Set the match logic and its fingerprint for it, in your Project's Settings.


### 1. Identify Match Logic

Let's say you want all issues with error **type** of "OperationalError to group together. In this case your match syntax will be based on:

[screenshot w red highlight around error.type]

Let's say you only want OperationalErrors to group together if their **message** has "environment" but it doesn't matter whether it's the "...company-shared" or "...company-production" environment. In this case your matcher is:

[screenshot w red highlight around error.message]

### 2. Implement
Here's how to set the match based on the error **type**

[screenshot for type]
```
type:OperationalError -> operational-error-type
```

Now, all events coming in with OperationalError will get a fingerprint of operational-error-type and will get grouped under a single issue. This only applies to future events coming in. Each event for this issue might have a different stack trace, but stack trace is no longer used as the default grouping rule.

Here's how to set the match based on the error **message**

[screenshot for message]
```
message: "could not translate host name*" -> operational-error-type
```

You could also do this based on the file path of the erroring funciton, or the function name itself. See [additional examples](https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/#examples)
[SCREENSHOT?]