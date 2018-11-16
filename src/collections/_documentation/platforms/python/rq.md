---
title: RQ (Redis Queue)
sidebar_order: 2
---

{% version_added 0.5.1 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.rq.RqIntegration`*

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
    --sentry-dsn=""  # Keep this empty! Disables RQ's own Sentry plugin
```

<!-- ENDWIZARD -->

The integration will automatically report errors from all RQ jobs.

Generally, make sure that the **call to `init` is loaded on worker startup**, and not only in the module where your jobs are defined. Otherwise the initialization happens too late and events might end up not being reported.

The `--sentry-dsn=""` is necessary if you use the `SENTRY_DSN` environment variable to configure the new SDK. RQ will otherwise attempt to install its own Sentry integration (using Raven) next to the one of `sentry-sdk`, which will cause issues such as doubly reported events. See [the relevant RQ issue](https://github.com/rq/rq/issues/1003).
