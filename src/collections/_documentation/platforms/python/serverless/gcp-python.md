# GCP


## Integrating Python SDK in GCP

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of how your application works.

On your GCP environment, create a Python function and in the ````requirement.txt```` section, install the sentry SDK:

````python
sentry_sdk
````

### Connecting the SDK to Sentry

After you have completed setting up a project in Sentry, Sentry will give you a value that is a DSN or Data Source Name. It looks like a standard URL, but it is just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.
Add DSN value in ````main.py````:

````python
import sentry_sdk
from sentry_sdk.integrations.serverless import serverless_function

sentry_sdk.init(dsn="Your DSN")

@serverless_function
def my_function(...):
    ...

````
Use the generic integration by calling the ````serverless_function```` decorator. Decorators wrap a function and modify its behavior. Apply the ````serverless_function```` decorator to each function that might throw errors. 

Deploy and test the function.

## Additional Data

Sentry supports additional data with events. Often this data is shared among any issue captured in its lifecycle, and includes the following components:

- **Tags**: Key/value pairs and search filters.
- **Level**: An event’s severity.
- **GCP Specific**: Includes GCP specific information.
- **Packages**: Information about Python packages.

### GCP Specific Data

Sentry captures the following additional information for an event in GCP:

- **sys.argv**: Displays the system argument for cloud function.

You can send arbitrary key/value pairs of data which the Sentry SDK will store alongside the event. These are not indexed and the Sentry SDK uses them to add additional information about what might be happening.
````python
scope.set_extra(“cloud_function_name”, “sample_cloud_function”)
````
## Behavior

- The GCP Cloud function Node.js SDK captures following scenarios in the Sentry dashboard::
	* Handled exception 
	* Unhandled exception
	* Network errors:
		- Invalid IP address
		- Invalid Port number
- Each call of a decorated function will block and wait for current events to be sent before returning.
When there are no events to be sent, no delay is added. However, if there are errors, it will delay the return of your serverless function until the events are sent. This is necessary as serverless environments typically reserve the right to kill the runtime/VM when they consider it is unused.
- Request data is attached to all events: HTTP method, URL, headers, form data, JSON payloads. Sentry excludes raw bodies and multipart file uploads. Sentry also excludes personally identifiable information (such as user ids, usernames, cookies, authorization headers, IP addresses) unless you set ````send_default_pii```` to ````True````. This is applicable to all the events.
- Generally the behavior is quite similar to the generic serverless integration.