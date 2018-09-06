---
title: Vue
sidebar_order: 30
---

```javascript
import * as Sentry from '@sentry/browser'
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations (integrations) {
    integrations.push(new Sentry.Integrations.Vue({ Vue }))
    return integrations
  }
})
```