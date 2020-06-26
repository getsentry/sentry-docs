# Azure


## Integrating Node.js SDK in Azure

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of how your application works.

On your Azure environment, create a nodejs function and install the required dependencies. 
For more information, see:
- [Create a function in Azure using VS Code](https://docs.microsoft.com/en-in/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript) 
- [Create a function using Azure Portal](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function)


Install our Nodejs SDK in Azure:
````js
npm install @sentry/node
````

### Connecting the SDK to Sentry

After you have completed setting up a project in Sentry, Sentry will give you a value that is a DSN or Data Source Name. It looks like a standard URL, but it is just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

````js
// Import the Sentry module.
const Sentry = require("@sentry/node");

// Configure the Sentry SDK.
Sentry.init({
  dsn: "<Your dsn>",
});
module.exports = async function (context, req) {
    // below is the faulty code, callUndefinedFunction() function is not exist.
    // Handle exception using try-catch block
    try{
        callUndefinedFunction();  // Call undefined function.
    }catch(error){
        Sentry.captureException(error);  // Capture the exception in Sentry dashboard.
        Sentry.flush(2000);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Hello from Azure cloud function"
    };
}
````
*To capture the errors in the Sentry dashboard, add the ````Sentry.captureException```` and ````Sentry.flush```` functions, else the errors will not be captured in the dashboard.*

Deploy and test the function. 

## Behavior

- The Azure Cloud function Node.js SDK captures the following scenario in the Sentry dashboard:
	* Initialization error
	* Handled exception 
- Request data is attached to all events: HTTP method, URL, headers, form data, JSON payloads. Sentry excludes raw bodies and multipart file uploads. Sentry also excludes personally identifiable information (such as user ids, usernames, cookies, authorization headers, IP addresses) unless you set ````send_default_pii```` to ````True````. This is applicable to all the events.
- Generally the behavior is quite similar to the generic serverless integration.