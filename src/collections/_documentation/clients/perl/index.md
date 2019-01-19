---
title: Perl
sidebar_order: 10
---

{% capture __alert_content -%}
The Perl SDK is maintained and supported by the Sentry community. Learn more about the project on [GitHub](https://github.com/rentrak/perl-raven).
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Support"
  content=__alert_content
%}

## Installation

`Sentry::Raven` is distributed via [CPAN](https://metacpan.org/pod/Sentry::Raven):

```bash
cpanm Sentry::Raven
```

## Configuring the SDK

Create a new instance of the SDK:

```perl
my $sentry = Sentry::Raven->new( sentry_dsn => '___DSN___' );
```

## Reporting Errors

The easiest way to capture errors is to execute code within a block:

```perl
# capture all errors
$sentry->capture_errors( sub {
    ..do something here..
} );
```

For more information, see the [CPAN documentation](https://metacpan.org/pod/Sentry::Raven).

## Resources

-   [Bug Tracker](https://github.com/rentrak/perl-raven/issues)
-   [GitHub Project](https://github.com/rentrak/perl-raven)
