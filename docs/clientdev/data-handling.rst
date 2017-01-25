Data Handling
=============

Sensitive Data
--------------

SDKs should provide some mechanism for scrubbing data. Ideally through
an extensible interface that the user can customize the behavior of.

This is generally done as part of the SDK configuration::

    client = Client(..., {
        'processors': ['processor.className'],
    })

Each processor listed would be some sort of extensible class or a function
callback. It would have a single designated method that is passed the data
(after it's been populated), and would then return the data fully intact,
or modified with various bits filtered out.

For example, if you simply supported callbacks for processors, it might
look like this::

    function my_processor($data) {
        foreach ($data['extra'] as $key => $value) {
            if (strpos($value, 'password')) {
                $data[$key] = '********';
            }
        }
    }

We recommend scrubbing the following values:

* Values where the keyname matches 'password', 'passwd', or 'secret'.
* Values that match the regular expression of
  ``r'^(?:\d[ -]*?){13,16}$'`` (credit card-like).
* Session cookies.
* The Authentication header (HTTP).

Keep in mind, that if your SDK is passing extra interface data (e.g.
HTTP POST variables) you will also want to scrub those interfaces. Given
that, it is a good idea to simply recursively scrub most variables other
than predefined things (like HTTP headers).

Variable Size
-------------

Most arbitrary values in Sentry have their size restricted. This means any
values that are sent as metadata (such as variables in a stacktrace) as well
as things like extra data, or tags.

- Mappings of values (such as HTTP data, extra data, etc) are limited to 50
  item pairs.
- Event IDs are limited to 32 characters.
- Tag keys are limited to 32 characters.
- Tag values are limited to 200 characters.
- Culprits are limited to 200 characters.
- Most contextual variables are limited to 512 characters.
- Extra contextual data is limited to 4096 characters.
- Messages are limited to ~10kb.
- Http data (the body) is limited to 2048 characters.
- Stacktraces are limited to 50 frames. If more are sent, data will be
  removed from the middle of the stack.
