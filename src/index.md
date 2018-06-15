---
layout: doc
title: Sentry Documentation
breadcrumb: Documentation
description: |
  Sentry is designed to be very simple to get off the ground, yet powerful to grow into. If you have never used Sentry before, this tutorial will help you with getting started.
---

{% include components/alert.html content="Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content." %}

---

#### Configure an SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform specific, and allow Sentry to have a deep understanding of both how your application works. In case your environment is very specific, you can also roll your own SDK using our document SDK API.

<div class="dropdown mb-2">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Integrations
  </button>
  <div class="dropdown-menu px-2" aria-labelledby="dropdownMenuButton">
    <div class="row no-gutters pb-2">
      <h5 class="col-12 pl-1 pt-1">Title</h5>
      <div class="col-6 d-flex flex-column">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
      <div class="col-6 d-flex flex-column">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>
    <div class="row no-gutters">
      <h5 class="col-12 pl-1 pt-1">Title</h5>
      <div class="col-6 d-flex flex-column">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
      <div class="col-6 d-flex flex-column">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>
  </div>
</div>

<pre class="pre p-2 mb-5"><code>&lt;p&gt;Sample text here...&lt;/p&gt;
&lt;p&gt;And another line of sample text here...&lt;/p&gt;
</code></pre>

---

#### About the DSN

After you complete setting up a project in Sentry, you’ll be given a value which we call a DSN, or Data Source Name. It looks a lot like a standard URL, but it’s actually just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public and secret keys, the server address, and the project identifier.

The DSN can be found in Sentry by navigating here:

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
