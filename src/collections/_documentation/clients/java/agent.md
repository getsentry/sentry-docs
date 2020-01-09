---
title: 'Agent (Discontinued)'
sidebar_order: 9
---

{% capture __alert_content -%}
The Java Agent has been discontinued and won't be supported.
{%- endcapture -%}
{%- include components/alert.html
    title="Deprecated"
    content=__alert_content
    level="danger"
%}

As of version 1.5.0 there is a new **experimental (beta)** Java Agent available that enhances the existing Sentry Java SDK. The agent will enhance your application stack traces on Sentry by adding the names and values of local variables to each frame.

## Usage

The latest agent can be [downloaded from GitHub](https://github.com/getsentry/sentry-java/releases).

Once you have downloaded the correct agent, you need to run your Java application with the `-agentpath` argument. For example:

```bash
java -agentpath:/path/to/libsentry_agent_linux-x86_64.so -jar app.jar
```

You will still need to install and configure the [Sentry Java SDK]({%- link _documentation/clients/java/index.md -%}). In addition, **you must set the** `stacktrace.app.packages` option. Only exceptions that contain at least one frame from your application will be processed by the agent. You can find details about this option [on the configuration page]({%- link _documentation/clients/java/config.md -%}#in-application-stack-frames).

With the SDK configured the agent should automatically enhance your events where applicable.

![Example of local variable state in the Sentry UI]({% asset java-agent.png @path %})
