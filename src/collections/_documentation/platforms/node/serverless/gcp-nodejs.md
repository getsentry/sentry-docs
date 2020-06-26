# GCP


## Integrating Node.js SDK in GCP

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of how your application works.

On your GCP environment, create a node.js function and in the ````package.json```` section, install the sentry SDK as a dependency:

````js
"@sentry/node": "^5.16.1"
````

### Connecting the SDK to Sentry

After you have completed setting up a project in Sentry, Sentry will give you a value that is a DSN or Data Source Name. It looks like a standard URL, but it is just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

Add DSN value in ````index.js````:

````js
"use strict";

// Import the Sentry module.
const Sentry = require("@sentry/node");
// Configure the Sentry SDK.
Sentry.init({
  dsn: "<your DSN>",
});

// below is the faulty code, notExistCloudFunction() function is not exist.
// Handled exception using try catch block
try {
  notExistCloudFunction(); // Call undefined function.
} catch (e) {
  Sentry.captureException(e); // Capture the exception in Sentry dashboard.
  Sentry.flush(2000);
}

exports.cloud_handler = (event, context) => {
  return {
    status_code: "200",
    body: "Hello from GCP Cloud Function!",
  };
};
````

*To capture the errors in the Sentry dashboard, add the ````Sentry.captureException```` and ````Sentry.flush```` functions, else the errors will not be captured in the dashboard.*

Deploy and test the function. 

## Behavior

- The GCP Cloud function Node.js SDK captures following scenarios in the Sentry dashboard::
	* Initialization error
	* Handled exception 
- Request data is attached to all events: HTTP method, URL, headers, form data, JSON payloads. Sentry excludes raw bodies and multipart file uploads. Sentry also excludes personally identifiable information (such as user ids, usernames, cookies, authorization headers, IP addresses) unless you set ````send_default_pii```` to ````True````. This is applicable to all the events.
- Generally the behavior is quite similar to the generic serverless integration.