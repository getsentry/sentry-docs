---
name: Symfony
doc_link: https://docs.sentry.io/platforms/php/guides/symfony/
support_level: production
type: framework
---

Symfony is supported via the [`sentry-symfony`](https://github.com/getsentry/sentry-symfony) package as a native bundle.

## Install

Install the `sentry/sentry-symfony` bundle:

```bash
composer require sentry/sentry-symfony
```

<Note>

Due to a bug in all versions below `6.0` of the [`SensioFrameworkExtraBundle`](https://github.com/sensiolabs/SensioFrameworkExtraBundle) bundle, you will likely receive an error during the execution of the command above related to the missing `Nyholm\Psr7\Factory\Psr17Factory` class. To workaround the issue, if you are not using the PSR-7 bridge, please change the configuration of that bundle as follows:

```yaml
sensio_framework_extra:
  psr_message:
    enabled: false
```

For more details about the issue see [https://github.com/sensiolabs/SensioFrameworkExtraBundle/pull/710](https://github.com/sensiolabs/SensioFrameworkExtraBundle/pull/710).

</Note>

## Configure

Add your DSN to `config/packages/sentry.yaml`:

```yaml {filename:config/packages/sentry.yaml}
sentry:
  dsn: '%env(SENTRY_DSN)%'
```

And in your `.env` file:

```plain {filename:.env}
###> sentry/sentry-symfony ###
SENTRY_DSN="___PUBLIC_DSN___"
###< sentry/sentry-symfony ###
```

<Alert level= "warning" title="Performance">

Performance monitoring integrations to support tracing are enabled by default. To use them, update to the latest version of the SDK.

These integrations hook into critical paths of the framework and of the vendors. As a result, there may be a performance penalty. To disable tracing, please see the [Integrations documentation](/platforms/php/guides/symfony/performance/pm-integrations/).

</Alert>

If you **are not** using Symfony Flex, you'll also need to enable the bundle in `config/bundles.php`:

```php {filename:config/bundles.php}
<?php

return [
    // ...
    Sentry\SentryBundle\SentryBundle::class => ['all' => true],
];
```

### Monolog Integration

If you are using [Monolog](https://github.com/Seldaek/monolog) to report events instead of the typical error listener approach, you need this additional configuration to log the errors correctly:

```yaml {filename:config/packages/sentry.yaml}
sentry:
  register_error_listener: false # Disables the ErrorListener to avoid duplicated log in sentry
  register_error_handler: false # Disables the ErrorListener, ExceptionListener and FatalErrorListener integrations of the base PHP SDK

monolog:
  handlers:
    sentry:
      type: sentry
      level: !php/const Monolog\Logger::ERROR
      hub_id: Sentry\State\HubInterface
```

If you are using a version of [MonologBundle](https://github.com/symfony/monolog-bundle) prior to `3.7`, you need to
configure the handler as a service instead:

```yaml {filename:config/packages/sentry.yaml}
monolog:
  handlers:
    sentry:
      type: service
      id: Sentry\Monolog\Handler

services:
  Sentry\Monolog\Handler:
    arguments:
      $hub: '@Sentry\State\HubInterface'
      $level: !php/const Monolog\Logger::ERROR
```

Additionally, you can register the `PsrLogMessageProcessor` to resolve PSR-3 placeholders in reported messages:

```yaml {filename:config/packages/sentry.yaml}
services:
  Monolog\Processor\PsrLogMessageProcessor:
    tags: {name: monolog.processor, handler: sentry}
```

## Test the implementation

To test that both logger error and exception are correctly sent to sentry.io, you can create the following controller:

```php
<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class SentryTestController extends AbstractController
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @Route(name="sentry_test", path="/_sentry-test")
     */
    public function testLog()
    {
        // the following code will test if monolog integration logs to sentry
        $this->logger->error('My custom logged error.');

        // the following code will test if an uncaught exception logs to sentry
        throw new \RuntimeException('Example exception.');
    }
}
```

After you visit the `/_sentry-test` page, you can view and resolve the recorded error by logging into [sentry.io](https://sentry.io) and opening your project. Clicking on the error's title will open a page where you can see detailed information and mark it as resolved.
