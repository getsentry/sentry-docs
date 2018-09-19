---
title: Monolog
sidebar_order: 4
---

<!-- WIZARD -->
## Capturing Errors

Monolog supports Sentry out of the box, so you’ll just need to configure a handler:

```php
$client = new Raven_Client('___PUBLIC_DSN___');

$handler = new Monolog\Handler\RavenHandler($client);
$handler->setFormatter(new Monolog\Formatter\LineFormatter("%message% %context% %extra%\n"));

$monolog->pushHandler($handler);
```

## Adding Context

Capturing context can be done via a monolog processor:

```php
$monolog->pushProcessor(function ($record) {
    // record the current user
    $user = Acme::getCurrentUser();
    $record['context']['user'] = array(
        'name' => $user->getName(),
        'username' => $user->getUsername(),
        'email' => $user->getEmail(),
    );

    // Add various tags
    $record['context']['tags'] = array('key' => 'value');

    // Add various generic context
    $record['extra']['key'] = 'value';

    return $record;
});
```

## Breadcrumbs

Sentry provides a breadcrumb handler to automatically send logs along as crumbs:

```php
$client = new Raven_Client('___PUBLIC_DSN___');

$handler = new \Raven_Breadcrumbs_MonologHandler($client);
$monolog->pushHandler($handler);
```
<!-- ENDWIZARD -->
