---
title: Issue Grouping Rules
sidebar_order: 0
---


## What makes events merge together into an Issue? 
(setting the context here...)
Have you ever had something like the image below?

First understand/review how events group into an issue, like the testTypeIssue15 which has 4 Events. These all had something same called the [fingerprint](https://docs.sentry.io/data-management/event-grouping/) and the issues need to share the same fingerprint in order to group together

What is a fingerprint? A way to uniquely identify. Was is the default way? This is called a grouping, and the default grouping algorithm/technique is the stack trace. So if they have the same stack trace (and default algo used), then group together, like in testTypeIssue15.

The ones that look similar but are not getting grouped together, we can deduce, do not have the same fingerprint. If the same default algorithm was used, then this means different stacktrace.

Use the default grouping algorithm, or set the fingerprint yourself. You can see on an issue by clicking 'JSON' link, and search for the 'fingerprint'. If the default grouping is in place, the value should read as `{{ default }}`  


![Issues Dashboard]({% asset guides/grouping-and-fingerprints/issues-dashboard.png @path %})
## Why are some Issues ^^ not merging together?
While they look similar (event type, event value), the stacktrace on each is still not the same. It might vary by as few as 1 frame (link to Grouping Enhancements). To alter the frames (includes, excludes) that are used by grouping algorithm, different tutorial, this is more advanced, see Custom Grouping Enhancements. We have other techniques/solutions to consider first:


Fortunately, we can change the default grouping behavior to make them match on something other than stacktrace, from both the SDK and the Server side. This will be covered under Solutions

## INFO  
{% capture __alert_content -%}
By this point you have existing (similar looking) issues in your dashboard that you've decided you want grouped together (PartI...). Or, you want to set some rules for that next incoming issues will get grouped together. Let's divide these problems into their own Part in Solutions in next section.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

---


## Solutions
Let's divide the way you can group into issues into 2 parts. (mention grouping, is different than merging)?

In **Part I** we'll see how historical issues that you want to merge together. This might apply to the future new incoming issues, more on that in Part I. No settings or configuration required ("no typing")

In **Part II** we'll see how setting rules/configuration for new incoming issues. This will not affect historical issues.

{% capture __alert_content -%}
Note ? - There's what was used (grouping algorithm) to generate the fingerprint, and then there's the fingerprint (value) itself. Where to put this?
{%- endcapture -%}


## PART I - Merging Similar Issues
This is for merging similar issues and will not update future/next issues coming in.

Before merge  
![Before Merge]({% asset guides/grouping-and-fingerprints/before-merge.png @path %})

After merge  
![After Merge]({% asset guides/grouping-and-fingerprints/after-merge.png @path %})

We see that TestTypeIssue7 and TestTypeIssue8 were merged together. The resulting single Issue now has 2 Events. If we produce a TestIssue9 it will not get merged, and that's because Merging only affects historical issues (not same fingerprint value). In this experiment, all 3 issues had the same fingerprint (grouping algorithm) of `{{ default }}`` (see JSON) (which means default - group by the stacktrace), and you wouldn't want to group everything together simply because they were grouped by stacktrace.

You can also do this from inside a single issue. Click the Similar Issues tab  
![Similar Issues]({% asset guides/grouping-and-fingerprints/similar-issues.png @path %})

However, let's run the same experiment again but alter the grouping algorithm, and set a fingerprint manually.
...
In this case, 1,2 merge together so its Issue w/ 2 Events, but when we do the 3rd issue it gets merged. This is because it had the same fingerprint value, and not just same fingerprint grouping algorithm.

#### LESSON / INFO
Q. Will the next issues get merged into this set of 3 that I already merged?
A.  
"If the issues you merged had the default grouping algorithm of stacktrace, then similar-looking issues in the future won't get merged with them. THey'll only get merged if they have the exact same stacktrace."
"If the issues you merged had a custom set fingerprint, then all issues getting the same custom set fingerprint in the future will continue merging/grouping into this original issue"

## PART II - Rule for Custom Fingerprint
### Steps
Here's an overview of what we're going to do.
1. Pick several issues that you'd like to see merged together into 1. 
2. Identify something to match them together by (e.g. they share the same Error Type, Error Value, Function or Path) (see next section)
3. Set a rule for the fingerprint. The syntax for this is type:value -> fingerprint which you specify as a rule in your project's settings.
4. documentation - https://docs.sentry.io/data-management/event-grouping/server-side-fingerprinting/
5. You can set the fingerprint on both the server-side and the client-side

## Examples
### Server-Side Fingerprinting
(corresponds to Step3 above)
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