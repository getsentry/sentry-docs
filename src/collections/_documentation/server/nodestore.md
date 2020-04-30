---
title: 'Node Storage'
sidebar_order: 4
---

Sentry provides an abstraction called ‘nodestore’ which is used for storing key/value blobs.

The default backend simply stores them as gzipped blobs in in the ‘nodestore_node’ table of your default database.

## Django Backend

The Django backend stores all data in the ‘nodestore_node’ table, using a the gzipped json blob-as-text pattern.

The backend provides no options, so it should simply be set to an empty dict.

```python
SENTRY_NODESTORE = 'sentry.nodestore.django.DjangoNodeStorage'
SENTRY_NODESTORE_OPTIONS = {}
```

## Custom Backends

If you have a favorite data storage solution, it only has to operate under a few rules for it to work w/ Sentry’s blob storage:

-   set key to value
-   get key
-   delete key

For more information on implementating your own backend, take a look at `sentry.nodestore.base.NodeStorage`.
