# AWS Lambda


## Integrating Node.js SDK in AWS Lambda

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of how your application works.

Create a deployment package on your local machine and install the required dependencies in the deployment package. 
For more information, see [Building an AWS Lambda deployment package for Node.js](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/).

Install our Node.js SDK using pip:
````js
npm install @sentry/node
````

### Connecting the SDK to Sentry

After you have completed setting up a project in Sentry, Sentry will give you a value that is a DSN or Data Source Name. It looks like a standard URL, but it is just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.
````js
const Sentry = require("@sentry/node");

sentry.init(
    dsn="https://<key>@<organization>.ingest.sentry.io/<project>"
   )
try {
 notExistFunction();
} catch (<parameter name>) {
  Sentry.captureException (<parameter name>);
  Sentry.flush(2000);
}
````
*To capture the errors in the Sentry dashboard, add ````<parameter name>```` in the ````Sentry.captureException```` and ````Sentry.flush```` functions, else the errors will not be captured in the dashboard.*

Create the deployment package in .zip format and upload it to AWS Lambda as a Lambda function.

## Additional Data

Sentry supports additional data with events. Often this data is shared among any issue captured in its lifecycle, and includes the following components:
- **Tags:** Key/value pairs and search filters.
- **Level:** An event’s severity.
- **AWS Specific:** Includes CloudWatch logs and AWS Lambda specific information.


### AWS Specific Data

You can send arbitrary key/value pairs of data which the Sentry SDK will store alongside the event. These are not indexed and the Sentry SDK uses them to add additional information about what might be happening.

````js
scope.set_extra(“lambda_function_name”, “sample_lambda_function”)
````

## Behavior

- The AWS Node.js SDK captures following scenarios in the Sentry dashboard:
	- Lambda Initialization error
  - Network error
    * Wrong IP address
    * Wrong PORT number
- Request data is attached to all events: HTTP method, URL, headers, form data, JSON payloads. Sentry excludes raw bodies and multipart file uploads. Sentry also excludes personally identifiable information (such as user ids, usernames, cookies, authorization headers, IP addresses) unless you set ````send_default_pii```` to ````True````. This is applicable to all the events.