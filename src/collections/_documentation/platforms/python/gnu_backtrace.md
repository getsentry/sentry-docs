---
title: GNU Backtrace
sidebar_order: 2
---
<!-- WIZARD -->
The GNU backtrace integration parses native stack trace produced by [`backtrace_symbols`](https://linux.die.net/man/3/backtrace_symbols) from error messages and concatenates them with the Python traceback.

It is currently tested to work with server exceptions raised by [`clickhouse-driver`](https://github.com/mymarilyn/clickhouse-driver).

**This integration is experimental.** It may be removed in minor versions. When enabling this integration, expect to see new event groups due to new stack trace frames.

Add ``GnuBacktraceIntegration()`` to your ``integrations`` list:

```python
import sentry_sdk
from sentry_sdk.integrations.gnu_backtrace import GnuBacktraceIntegration

sentry_sdk.init("___PUBLIC_DSN___", integrations=[GnuBacktraceIntegration()])
```

<!-- ENDWIZARD -->
