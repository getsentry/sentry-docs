---
title: PHP
---

The Sentry PHP SDK provides support for PHP 7.1 or later.

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your application works.

To install the PHP SDK, you need to be using Composer in your project. For more details about Composer, see the [Composer documentation](https://getcomposer.org/doc/).

```bash
composer require sentry/sdk:{% sdk_version sentry.php.sdk %}
```

### Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

To capture all errors, even the one during the startup of your application, you should initialize the Sentry PHP SDK as soon as possible.

```php
Sentry\init(['dsn' => '___PUBLIC_DSN___' ]);
```

### Verifying Your Setup

Great! Now that you’ve completed setting up the SDK, maybe you want to quickly test out how Sentry works. You can trigger a PHP exception by throwing one in your application:

```php
throw new Exception("My first Sentry error!");
```

## Capturing Errors

In PHP you can either capture a caught exception or capture the last error with captureLastError.

```php
try {
    $this->functionFailsForSure();
} catch (\Throwable $exception) {
    Sentry\captureException($exception);
}

// OR

Sentry\captureLastError();
```

## Releases

{% include platforms/configure-releases.md %}

Finally, configure the SDK to send release information:

```php
Sentry\init([
  'dsn' => '___PUBLIC_DSN___',
  'release' => 'your release name'
]);
```

## Context

{% include platforms/event-contexts.md %}

### Extra Context
In addition to the structured context that Sentry understands, you can send arbitrary key/value pairs of data which the Sentry SDK will store alongside the event. These are not indexed, and the Sentry SDK uses them to add additional information about what might be happening.

```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setExtra('character_name', 'Mighty Fighter');
});
```

### Capturing the User

Sending users to Sentry will unlock many features, primarily the ability to drill down into the number of users affecting an issue, as well as to get a broader sense about the quality of the application.

```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setUser(['email' => 'john.doe@example.com']);
});
```

{% include platforms/user-attributes.md %}

### Tagging Events

Tags are key/value pairs assigned to events that can be used for breaking down
issues or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setTag('page_locale', 'de-at');
});
```

Several common uses for tags include:

- The hostname of the server
- The version of your platform (For example, iOS 5.0)
- The user’s language

Once you’ve started sending tagged data, you’ll see it show up in a few places:

- The filters within the sidebar on the project stream page.
- Summarized within an event on the sidebar.
- The tags page on an aggregated event.

We’ll automatically index all tags for an event, as well as the frequency and the last time the Sentry SDK has seen a value. Even more so, we keep track of the number of distinct tags and can assist you in determining hotspots for various issues.

### Setting the Level

You can set the severity of an event to one of five values: `fatal,` `error,` `warning,` `info,` and `debug.` `error` is the default, `fatal` is the most severe and `debug` is the least severe.

```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setLevel(Sentry\Severity::warning());
});
```

### Setting the Fingerprint

Sentry uses one or more “fingerprints” to decide how to group errors into issues.

For some very advanced use cases, you can override the Sentry default grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information and should be an array of strings.

If you wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{{default}}` as one of the items.

For more information, see [Aggregate Errors with Custom Fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).

## Advanced Usage

### Breadcrumbs

Sentry will automatically record specific events, such as changes to the URL and XHR requests to provide context to an error.

You can manually add breadcrumbs on other events or disable breadcrumbs.

```php
Sentry\addBreadcrumb(new Sentry\Breadcrumb(
  Sentry\Breadcrumb::LEVEL_ERROR, 
  Sentry\Breadcrumb::TYPE_ERROR, 
  'error_reporting', 
  'foo bar'
));
```

For more information, see:

- [Full documentation on Breadcrumbs]({%- link _documentation/enriching-error-data/breadcrumbs.md -%})
- [Debug Issues Faster with Breadcrumbs](https://blog.sentry.io/2016/05/04/breadcrumbs)

### Filter Events & Custom Logic

Sentry exposes a beforeSend callback which can be used to filter out information or add additional context to the event object.

```php
Sentry\init([
  'dsn' => '___PUBLIC_DSN___',
  'before_send' => function (Sentry\Event $event): ?Event {
    return $event;
  },
]);
```

For more information, see:

- [Full documentation on Filtering Events]({%- link _documentation/error-reporting/configuration/filtering.md -%})
- [Manage Your Flow of Errors Using Inbound Filters](https://blog.sentry.io/2017/11/27/setting-up-inbound-filters)


### Integrations

*Integrations* extend the functionality of the SDK for some common frameworks and
libraries.  Similar to plugins, they extend the functionality of the Sentry SDK.  
Integrations are configured by a call to `init()` method.

#### Web Frameworks
- [Laravel]({%- link _documentation/platforms/php/laravel.md -%})
- [Symfony]({%- link _documentation/platforms/php/symfony.md -%})

#### Default Integrations
Default integrations are integrations enabled by default that integrate into the standard library or the interpreter itself. They are documented so you can see what they do and that they can be disabled if they cause issues. To disable system integrations set default_integrations => false when calling init().

For more information, see full documentation on [Default Integrations]({%- link _documentation/platforms/php/default-integrations.md -%}).


### PHP Specific Options

PHP provides some additional options, all options can be passed into `init()`.

##### capture_silenced_errors
{% include components/alert.html
    content="This option was introduced in version 2.0.1"
    level="notice"
%}
This option enables capturing errors which were silenced using the `@` operator 
in your source code. Defaults to `false`. 

##### context_lines

This option sets the number of lines of code context to capture. If `null` is
set as the value, no source code lines will be added to each stack trace frame.
By default this option is set to `3`.

##### enable_compression

If this option is enabled, `gzip` compression will be enabled. Default is `true`.

##### error_types

This option accepts an int bitmask like the native PHP function [`error_reporting`](https://www.php.net/manual/en/function.error-reporting.php).
This value is used in the default `ErrorListenerIntegration` to filter out errors:
the default value will send all errors (same as setting `E_ALL`); if you want to 
exclude some types of errors, you just need to apply the right bitmask.

For example, if you want to get all errors but exclude notices and deprecations,
the right bitmask to apply is `E_ALL & ~E_NOTICE & ~E_DEPRECATED`.

##### excluded_app_paths

This option configures the list of paths to exclude from the `app_path` detection.

##### excluded_exceptions

Sometimes you may want to skip capturing certain exceptions. This option sets
the FQCN of the classes of the exceptions that you don't want to capture. The
check is done using the `instanceof` operator against each item of the array
and if at least one of them passes the event will be discarded.

Note that this behavior applies to the `captureException` function/method, which 
is also used in the automatic capture of errors; it's not applied to the `captureEvent`
function/method instead, that could be used as a manual override.

##### prefixes

This option sets the list of prefixes which should be stripped from the filenames
to create relative paths.

##### project_root

The root of the project source code. As Sentry is able to distinguish project
files from third-party ones (e.g. vendors), this option can be configured to
mark the directory containing all the source code of the application.

For example, assuming that the directory structure shown below exists, marking
the project root as `project-folder/src/` means that every file inside that
directory that is part of a stack trace frame will be marked as "application
code".

```

    project-folder/
    ├── vendor/
        ├── foo/
    ├── src/
        ├── bar/ <-- these are going to be marked as application files

``` 

##### send_attempts

The number of attempts that should be made to send an event before erroring
and dropping it from the queue.
By default this option is set to `6`.


##### max_request_body_size

This option represents the size limit in bytes beyond which the body of the request is not captured. The default value is `medium`. Possible values are `none` = never send body, `small`, `medium`, `always` = always send the body, no matter how large it is.
The values are chosen like this on purpose since the SDK internally can define what the exact limits are.

### Transport

Sentry PHP is not tied to any specific library that sends HTTP messages. Instead,
it uses [Httplug](https://github.com/php-http/httplug) to let users choose whichever PSR-7 implementation and HTTP client
they want to use.

We recommend that you use the `sentry/sdk` meta-package which provides our recommend HTTP client.

If you want to use a different HTTP client just install `sentry/sentry` with the clients you prefer:

```bash
composer require sentry/sentry:{% sdk_version sentry.php %} php-http/curl-client guzzlehttp/psr7
```

This will install the library itself along with an HTTP client adapter that uses
cURL as the transport method (provided by [Httplug](https://github.com/php-http/httplug) and a PSR-7 implementation
(provided by Guzzle). You do not have to use those packages if you do not want to.
The SDK does not care about which transport method you want to use because it's
an implementation detail of your application. You may use any package that provides
[php-http/async-client-implementation](https://packagist.org/providers/php-http/async-client-implementation) and [http-message-implementation](https://packagist.org/providers/psr/http-message-implementation).

If you want to use Guzzle as an underlying HTTP client, you just need to run the
following command to install the adapter and Guzzle itself:

```bash
composer require php-http/guzzle6-adapter
```

#### Transport Classes

Transports are the classes in Sentry PHP that are responsible for communicating
with a service in order to deliver an event. There are several types of transports
available out-of-the-box, all of which implement the `TransportInterface`
interface;

- The `NullTransport` which is used in case you do not define a `DSN` in the options. It will not send events.
- The `HttpTransport` which is the default and will be used when the server
  is set in the client configuration.
- The `SpoolTransport` which can be used to defer the sending of events (e.g.
  by putting them into a queue).
  
The examples below pretty much replace the `init()` call.  
Please also keep in mind that once a Client is initialized with a Transport it cannot be
changed.

##### NullTransport

Although not so common there could be cases in which you don't want to send
events at all. The `NullTransport` transport does this: it simply ignores
the events, but report them as sent.

```php
use Sentry\ClientBuilder;
use Sentry\Transport\NullTransport;
use Sentry\State\Hub;
use Sentry\Transport\TransportFactoryInterface;

$transportFactory = new class implements TransportFactoryInterface {

    public function create(\Sentry\Options $options): \Sentry\Transport\TransportInterface
    {
        return new NullTransport();
    }
};

$builder = ClientBuilder::create(['dsn' => '___PUBLIC_DSN___']);
$builder->setTransportFactory($transportFactory);

Hub::getCurrent()->bindClient($builder->getClient());
```

{% include components/alert.html
    title="Note"
    content="`Hub::getCurrent()->bindClient($builder->getClient());` is required to make the global function calls to use your new `Client` instead."
    level="warning"
%}

##### HttpTransport

The `HttpTransport` sends events over the HTTP protocol using [Httplug](http://httplug.io/).
The best adapter available is automatically selected when creating a client instance
through the client builder, but you can override it using the appropriate methods.

```php
use Http\Discovery\HttpAsyncClientDiscovery;
use Http\Discovery\MessageFactoryDiscovery;
use Http\Discovery\StreamFactoryDiscovery;
use Http\Discovery\UriFactoryDiscovery;
use Http\Message\ResponseFactory;
use Http\Message\UriFactory;
use Sentry\ClientBuilder;
use Sentry\HttpClient\HttpClientFactory;
use Sentry\HttpClient\HttpClientFactoryInterface;
use Sentry\Transport\HttpTransport;
use Sentry\State\Hub;
use Sentry\Transport\TransportFactoryInterface;

$httpClientFactory = new HttpClientFactory(
    UriFactoryDiscovery::find(),
    MessageFactoryDiscovery::find(),
    StreamFactoryDiscovery::find(),
    HttpAsyncClientDiscovery::find(),
    'sentry.php',
    '2.3'
);

$transportFactory = new class($httpClientFactory) implements TransportFactoryInterface  {
    /**
     * @var HttpClientFactoryInterface
     */
    private $clientFactory;

    public function __construct(HttpClientFactoryInterface $clientFactory)
    {
        $this->clientFactory = $clientFactory;
    }

    public function create(\Sentry\Options $options): \Sentry\Transport\TransportInterface
    {
        return new HttpTransport($options, $this->clientFactory->create($options), MessageFactoryDiscovery::find());
    }
};


$builder = ClientBuilder::create(['dsn' => '___PUBLIC_DSN___']);
$builder->setTransportFactory($transportFactory);

Hub::getCurrent()->bindClient($builder->getClient());
```

{% include components/alert.html
    title="Note"
    content="`Hub::getCurrent()->bindClient($builder->getClient());` is required to make the global function calls to use your new `Client` instead."
    level="warning"
%}

##### SpoolTransport

The default behavior is to send events immediately. You may, however, want to
avoid waiting for the communication to the Sentry server that could be slow
or unreliable. Avoid this by choosing the `SpoolTransport` which
stores the events in a queue so that another process can read it and take
care of sending them. Currently only spooling to memory is supported.


```php
use Sentry\ClientBuilder;
use Sentry\Transport\SpoolTransport;
use Sentry\Transport\HttpTransport;
use Sentry\State\Hub;

$options = ['dsn' => '___PUBLIC_DSN___'];

$httpTransport = new HttpTransport($options, HttpAsyncClientDiscovery::find(), MessageFactoryDiscovery::find());

$spool = new MemorySpool();

$transportFactory = new class implements TransportFactoryInterface {
    public function create(\Sentry\Options $options): \Sentry\Transport\TransportInterface
    {
        return new SpoolTransport($spool);
    }
};

$builder = ClientBuilder::create($options);
$builder->setTransportFactory($transportFactory);

Hub::getCurrent()->bindClient($builder->getClient());

// When the spool queue is flushed the events are sent using the transport
// passed as parameter of the flushQueue method.
  
$spool->flushQueue($httpTransport);
```

{% include components/alert.html
    title="Note"
    content="`Hub::getCurrent()->bindClient($builder->getClient());` is required to make the global function calls to use your new `Client` instead."
    level="warning"
%}
