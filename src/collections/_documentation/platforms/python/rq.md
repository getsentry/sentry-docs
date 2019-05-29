---
title: RQ (Redis Queue)
sidebar_order: 2
---

{% version_added 0.5.1 %}

<!-- WIZARD -->
The RQ integration adds support for the [RQ Job Queue System](https://python-rq.org/).

Create a file called `mysettings.py` with the following content:

```python
import sentry_sdk
from sentry_sdk.integrations.rq import RqIntegration

sentry_sdk.init("___PUBLIC_DSN___", integrations=[RqIntegration()])
```

Start your worker with:

```shell
rq worker \
    -c mysettings \  # module name of mysettings.py
    --sentry-dsn=""  # only necessary for RQ < 1.0
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

The integration will automatically report errors from all RQ jobs.

Generally, make sure that the **call to `init` is loaded on worker startup**, and not only in the module where your jobs are defined. Otherwise, the initialization happens too late and events might end up not being reported.

## The `--sentry-dsn` CLI option

Passing `--sentry-dsn=""` to RQ forcibly disables [RQ's shortcut for using Sentry](https://python-rq.org/patterns/sentry/). For RQ versions before 1.0 this is necessary to avoid conflicts, because back then RQ would attempt to use the `raven` package instead of this SDK. Since RQ 1.0 it's possible to use this CLI option and the associated RQ settings for initializing the SDK.

We still recommend against using those shortcuts because it would be harder to provide options to the SDK at a later point. See [the GitHub issue about RQ's Sentry integration](https://github.com/rq/rq/issues/1003) for discussion.
