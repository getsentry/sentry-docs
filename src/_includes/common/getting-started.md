<!--
Guideline: This page is common to all SDKs; add the name of the SDK you're documenting as well as the code samples as instructed. If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can quickly complete an ideal integration.**
-->

Add Sentry's {{ include.sdk_name }} SDK to automatically report errors and exceptions in your application. 

On this page, we provide concise information to get you up and running quickly. To learn more, use the links to in-depth content. Also, if you don't already have an account and Sentry project established, head over to [Sentry.io](https://sentry.io/signup/), then return to this page.

In the right place? We also offer documentation for:

<!-- 
Guideline: Add icons for related languages/frameworks.
-->

What's covered on this page:

- [Install](#install)
- [Configure](#configure)
- [Verify Setup](#verify-setup)
- [Capture Errors](#capture-errors)
    1. [Enrich Error Data](#enrich-error-data) 
    2. [Set the Release Version](#set-the-release-version)
<!--
Guideline: Add any step to set up information that's specific to the SDK; for example, in the JavaScript example, this heading is for Source Maps. Then add the link to that heading
-->
- [Monitor Performance](#monitor-performance)

## Install

Sentry captures data by using an SDK within your application’s runtime. Choose your installation method:

{{ include.install_content }}
<!--
Guideline: Add SDK specific installation information
-->

## Configure

`init` Sentry as soon as possible:

{{ include.config_content }}
<!--
Guideline: Add init code example for this SDK 
-->

Once this is done, all unhandled exceptions are automatically captured by Sentry. 

**Important: Note your DSN.** The *DSN* (Data Source Name) tells the SDK where to send the error, associating errors with the project you just created. If you forget your DSN, log in to Sentry and view your organization's *Settings -> Projects -> Client Keys (DSN)* in the Sentry web UI. The DSN includes the protocol, public key, server address, and project identifier, using this format:

```https://<Public Key>@<Sentry Server Address>/<Project Identifier>```

## Verify Setup

Verify your setup by intentionally sending an error that breaks your application. An *event* is one instance of sending data to Sentry. Generally, this data is an error. An *issue* is a grouping of similar events.

For example, in {{ include.sdk_name }}, 
<!--
Guideline: Add verify setup example for the SDK you are documenting
-->
Resolve the created error by logging in to Sentry, then opening your project. On the **Issue Details** page, scroll down to the Exception stack trace and view the error. 

## Capture Errors

The reporting of an *event* - an error or exception - is called *capturing*. When an event is captured, it’s sent to Sentry.
<!--
Guideline: Add SDK specific information, as appropriate
-->
Learn more about how to manually capture errors or enable message capture with the {{ include.sdk_name }} SDK in Capture Errors <!--link to the Capture Errors content for this SDK-->.


### Enrich Error Data

When the SDK sends an event to Sentry, the event is enriched with data to help identify the source of the event. We include data both pertinent to the event as well as what led up to the event. Much of this data is sent automatically - including the error context <!-- add other items sent automatically for this SDK; for example, in JavaScript, the environment is automaticlly sent, then add a link to the Event Context content for this SDK--> - as well as the trail of events that happened prior to an issue, which we call breadcrumbs <!--link to the breadcrumbs content for this SDK-->. You don't need to configure these, though you may modify them. 

Learn more about enriching data sent with events in Enrich Event Data <!--link to the Enrich Event Data page for this SDK-->.

### Set the Release Version

When you configure Sentry to include the version of your application, Sentry can tell you about regressions as well as detailed information about the suspect commit. 

Use the<!--SDK setting-->:

<!-- SDK configuration example -->

After you inform Sentry of a new release, you will see information about it, such as new issues and regressions introduced in the release.

Learn more about what releases can do, including using a repository integration, creating the release and associated commits, and telling Sentry when you deploy a release in Track Releases. <!--link to the Track Releases page for this SDK-->

<!--
### SDK-Specific Setup

Here, add information that is particular to the SDK you are documenting. For example, in the JavaScript SDK, this is where we discuss setting up Source Maps.
-->

## Monitor Performance

Performance monitoring helps developers measure Apdex, Throughput, and trace slow transactions down to the poor performing API call or DB query. Available for both JavaScript and Python SDKs, performance monitoring helps you both diagnose problems and measure your application's overall health. 

To get started with performance monitoring, first install the `@sentry/tracing` package:

<!--
Guideline: Add SDK specific installation information
-->

Next, configure your call to `Sentry.init`:

<!-- SDK example, setting sample rate to 25% of captured transactions -->

Performance data is transmitted using a new event type called `transactions` <!--link to Distributing Tracing-->. **To sample transactions, you must set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured transactions.Learn more about sampling in Using Your SDK to Filter Events <!--add link to this content for the SDK you are documenting-->.

Next steps:

- Manage your SDK Configuration <!--add link-->
- Learn more about enriching event data <!--add link-->
- Review and manage integrations <!--add link-->
- Review common problems <!--add link-->