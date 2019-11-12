---
title: Issue Grouping Rules
sidebar_order: 0
---

## What makes Sentry Events group together into an Issue? 
Have you ever had something like the image below?
![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issues-dashboard.png @path %})

Let's first understand why testTypeIssue15 has 4 Events which grouped into the Issue. These events shared the same value for something called the [fingerprint](https://docs.sentry.io/data-management/event-grouping/)

**What is a fingerprint?** It is a way to uniquely identify an event in Sentry. It is set by default using a hash of the stacktrace, which is the default grouping algorithm. If 2 events have the same stacktrace and the default grouping is left in place, then they group together into 1 Issue.

**Do I need to do anything?**  Only if you want to change the grouping behavior to set your own fingerprints and control the grouping of certain issues, which is what the rest of this Guide will cover. Otherwise, the default grouping will be by stacktrace. To verify the fingerprint at the event level, open an issue and click the JSON link, and find the `fingerprint` property. If the default grouping was used, you'll see 'default' written there. If different grouping was used, you'll see the actual fingerprint value itself.

## Why are similar looking Issues not grouping together?
While everything that meets the eye in the Issues dashboard looks similar, there is something that still differs: the stacktrace, and therefore the fingerprint. Let's compare two similar looking issues side-by-side:

![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issue-stacktraces-comparison.png @path %})

Notice the only difference is one had function `testTypeIssue15` and the other had function `testTypeIssue14`. This means the stacktraces are not identical.

Sometimes one stacktrace has extra frames. To include or exclude frames from the stacktrace (think middlewares, node_modules, library imports), see [Custom Grouping Enhancements](https://docs.sentry.io/data-management/event-grouping/grouping-enhancements/).

{% capture __alert_content -%}
Fortunately, we can change the default grouping behavior to make certain issue types match on something other than stacktrace, from both the **SDK side** and the **Server side**.
{%- endcapture -%}
{%- include components/alert.html
    title="SUMMARY"
    content=__alert_content
    level="warning"
%}

# Solutions
By this point you similar looking issues in your dashboard that you want to merge together. Or, you want to set some rules for that next incoming issues will get grouped together. These are 2 different scenarios. Let's divide the approaches into Part I and Part II.

In **PART I** we'll see how historical issues can be merged together. No settings or configuration required to do this.

In **PART II** we'll see how to set rules for new incoming issues of our choice to get grouped together by. This will not affect historical issues.

## PART I - Merging Similar Issues
This is for merging similar issues and will not update future/next issues coming in.

Before merge  
![Before Merge]({% asset guides/grouping-and-fingerprints/before-merge.png @path %})

After merge, we see that TestTypeIssue7 and TestTypeIssue8 were merged together.
![After Merge]({% asset guides/grouping-and-fingerprints/after-merge.png @path %})

You can also do this from inside a single issue. Click the Similar Issues tab  
![Similar Issues]({% asset guides/grouping-and-fingerprints/similar-issues.png @path %})

{% capture __alert_content -%}
Q. Will the next issues get merged into this set of 3 that I already merged?
A. If the issues you merged had the default grouping algorithm of stacktrace, then similar-looking issues in the future won't get merged with them. THey'll only get merged if they have the exact same stacktrace.
If the issues you merged had a custom set fingerprint, then all issues getting the same custom set fingerprint in the future will continue merging/grouping into this original issue
{%- endcapture -%}
{%- include components/alert.html
    title="QUESTION"
    content=__alert_content
    level="warning"
%}

## PART II - Rule for Custom Fingerprint

Here's an overview of what we'll do using **Server-Side Fingerprinting**
1. Pick several issues that you'd like to see merged together into 1. 
2. Identify something to match them together by (e.g. type of error)
3. Set a rule for the fingerprint. The syntax for this is type:value -> fingerprint which you specify as a rule in your project's settings.


### 1 - Pick issues for merging

Let's say you want the following two issues merged together because they both are OperationalErrors and contain "could not translate host name" but it doesn't matter to you whether it's to the "company-shared" or "company-production" environment.

IMAGE...of two of these OperationErrors

### 2 - Identify how to match
Here's how to set the match based on the error.type  
`type:OperationalError -> operational-error-type`

Now, all events coming in with OperationalError will get force assigned a fingerprint of operational-error-type and will get grouped under the same 1 Issue. This only applies to future events coming in. Each event for this 1 Issue might have a different stacktrace, but we're no longer using stacktrace as the default grouping rule. Instead, we are using  
`type:OperationalError`

### 3 - Set a rule
Here's how to set the match using a regex on the error.value:  
`value:"could not translate host name*" -> operational-error-type`

You could also do this based on the path or the function, see [additional examples](https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/#examples)

Here's an overview of how to do this using **SDK Side Fingerprinting**, see [SDK Fingerprinting](https://docs.sentry.io/data-management/event-grouping/sdk-fingerprinting/?platform=javascript) which involves updating code on your end. I can work with you on this.


# Note
- list all the differen Types of errors (OperationalError, RangeError) and some example error messages
- list examples of error messages being so close but different, by say an ID/number.
- note on importance of sourcemaps/symbols for js/native
- groupin by stacktrace vs grouping by exception DATA
- internal, record what this Guide offers, compared to docs.sentry.io
- images, scrub customer data / use my own data, it's less of an eyesore. more pertient, less noisy.
