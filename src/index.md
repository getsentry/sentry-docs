---
layout: doc
title: Getting Started
description: |
  Sentry is designed to be very simple to get off the ground, yet powerful to grow into. If you have never used Sentry before, this tutorial will help you with getting started.
---

<h5 class="text-center mb-3">Getting started with Sentry is a three step process:</h5>

<div class="row bg-light process mb-4">
  <div class="col pt-3 pb-2 text-center">
    <div class="icon mx-auto d-block mb-1">
      {% include /svg/sign-up.svg %}
    </div>
    <small class="text-uppercase"><b>Sign Up</b></small>
  </div>
  <div class="col pt-3 pb-2 text-center">
    <div class="icon mx-auto d-block mb-1">
      {% include /svg/configure-sdk.svg %}
    </div>
    <small class="text-uppercase"><b>Configure SDK</b></small>
  </div>
  <div class="col pt-3 pb-2 text-center">
    <div class="icon mx-auto d-block mb-1">
      {% include /svg/about-the-dsn.svg %}
    </div>
    <small class="text-uppercase"><b>Learn About The DSN</b></small>
  </div>
</div>

{% include components/alert.html content="Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content." %}

---

#### Configure an SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform specific, and allow Sentry to have a deep understanding of both how your application works. In case your environment is very specific, you can also roll your own SDK using our document SDK API.

<pre class="pre p-2 mb-5"><code>&lt;p&gt;Sample text here...&lt;/p&gt;
&lt;p&gt;And another line of sample text here...&lt;/p&gt;
</code></pre>

##### Popular integrations are:
<div class="integrations mb-2">
  <div class="row">
    <div class="col-sm">
      <div class="icon mb-1 mx-auto d-block">
        {% include /svg/about-the-dsn.svg %}
      </div>
      <small><b>One of six columns</b></small>
    </div>
    <div class="col-sm">
      <div class="icon mb-1 mx-auto d-block">
        {% include /svg/about-the-dsn.svg %}
      </div>
      <small><b>Two of six columns</b></small>
    </div>
    <div class="col-sm">
      <div class="icon mb-1 mx-auto d-block">
        {% include /svg/about-the-dsn.svg %}
      </div>
      <small><b>Three of six columns</b></small>
    </div>
  </div>
  <div class="row">
    <div class="col-sm">
      <div class="icon mb-1 mx-auto d-block">
        {% include /svg/about-the-dsn.svg %}
      </div>
      <small><b>Four of six columns</b></small>
    </div>
    <div class="col-sm">
      <div class="icon mb-1 mx-auto d-block">
        {% include /svg/about-the-dsn.svg %}
      </div>
      <small><b>Five of six columns</b></small>
    </div>
    <div class="col-sm">
      <div class="icon mb-1 mx-auto d-block">
        {% include /svg/about-the-dsn.svg %}
      </div>
      <small><b>Six of six columns</b></small>
    </div>
  </div>
</div>

For exact configuration for the integration, consult the corresponding documentation. For all SDKs however, the basics are the same.

---

#### About the DSN

After you complete setting up a project in Sentry, you’ll be given a value which we call a DSN, or Data Source Name. It looks a lot like a standard URL, but it’s actually just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public and secret keys, the server address, and the project identifier.

The DSN can be found in Sentry by navigating here:

<div class="bg-light process mb-4">
  <div class="d-flex align-items-center p-2">
    <span class="badge badge-secondary mr-2">
      1
    </span>
    <span class="">
      <b>One of six columns</b>
    </span>
  </div>
  <div class="d-flex flex-row align-items-center p-2">
    <span class="badge badge-secondary mr-2">
      2
    </span>
    <span class="">
      <b>One of six columns</b>
    </span>
  </div>
  <div class="d-flex flex-row align-items-center p-2">
    <span class="badge badge-secondary mr-2">
      3
    </span>
    <span class="">
      <b>One of six columns</b>
    </span>
  </div>
</div>

Its template resembles the following:

If you are using the Hosted Sentry and signed into your account, the documentation will refer to your actual DSNs. You can select the correct one which will adjust the examples for easy copy pasting:

It is composed of five important pieces:

- The Protocol used. This can be one of the following: http or https.
- The public and secret keys to authenticate the SDK.
- The destination Sentry server.
- The project ID which the authenticated user is bound to.
- You’ll have a few options for plugging the DSN into the SDK, depending on what it 	supports. At the very least, most SDKs will allow you to set it up as the 	SENTRY_DSN environment variable or by passing it into the SDK’s constructor.


**The JavaScript SDK works roughly like this:**

---

#### Next Steps

Now that you’ve got basic reporting setup, you’ll want to explore adding additional context to your data.

- Identifying Users via Context
- Tracing Issues With Breadcrumbs
- Capturing User Feedback on Crashes
