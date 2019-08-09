---
title: Apache Beam
sidebar_order: 2
---
<!-- WIZARD -->
The Beam integration currently parses the functions in [ParDo](https://github.com/apache/beam/blob/release-2.13.0/sdks/python/apache_beam/transforms/core.py#L991) to return exceptions in their respective setup, start_bundle, process, and finish_bundle functions.

The functions get injected with an inspect function to patch getting the [function signature](https://github.com/apache/beam/blob/release-2.13.0/sdks/python/apache_beam/transforms/core.py#L288L298).

**This integration is experimental.** It may be removed in minor versions. When enabling this integration, expect to see incorrect server_name and ip due to some distributed within Beam.

Add ``BeamIntegration()`` to your ``integrations`` list:

```python
import sentry_sdk
from sentry_sdk.integrations.beam import BeamIntegration

sentry_sdk.init("___PUBLIC_DSN___", integrations=[BeamIntegration()])
```

<!-- ENDWIZARD -->