**Koa**

To get started with performance monitoring with Koa, first install these packages:

```bash
# Using yarn
$ yarn add @sentry/node @sentry/apm

# Using npm
$ npm install @sentry/node @sentry/apm
```

Creates and attach a transaction to each context

```javascript
const Sentry = require('@sentry/node')
const { Span } = require('@sentry/apm')
const Koa = require('koa')
const app = new Koa()
const domain = require('domain')

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 0.25
})

// not mandatory, but adding domains do help a lot with breadcrumbs
const requestHandler = (ctx, next) => {
  return new Promise((resolve, reject) => {
    const local = domain.create()
    local.add(ctx)
    local.on('error', (err) => {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    })
    local.run(async() => {
      Sentry.getCurrentHub().configureScope(scope =>
        scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, ctx.request, {user: false}))
      )
      await next()
      resolve()
    })
  })
}

// this tracing middleware creates a transaction per request
const tracingMiddleWare = async (ctx, next) => {
    // captures span of upstream app
    const sentryTraceId =  ctx.request.get('sentry-trace')
    let traceId
    let parentSpanId
    if (sentryTraceId) {
      const span = Span.fromTraceparent(sentryTraceId)
      if (span) {
        traceId = span.traceId
        parentSpanId = span.parentSpanId
      }
    }
    const transaction = Sentry.startTransaction({
      name: `${ctx.method} ${ctx.url}`,
      op: 'http.server',
      parentSpanId,
      traceId,
    })
    ctx.__sentry_transaction = transaction
    await next()
    
    // if using koa router, a nicer way to capture transaction using the matched route
    if (ctx._matchedRoute) {
      const mountPath = ctx.mountPath || ''
      transaction.setName(`${ctx.method} ${mountPath}${ctx._matchedRoute}`)
    }
    transaction.setHttpStatus(ctx.status)
    transaction.finish()
}

app.use(requestHandler)
app.use(tracingMiddleWare)

// usual error handler
app.on('error', (err, ctx) => { 
  Sentry.withScope(function (scope) {
    scope.addEventProcessor(function (event) {
      return Sentry.Handlers.parseRequest(event, ctx.request)
    })
    Sentry.captureException(err)
  })
})
// the rest of your app
```

**Subsequent manual child transactions**

The following example creates a transaction for a part of the code that contains an expensive operation, and sends the result to Sentry, you will need to use the transaction stored in the context

```javascript
const myMiddleware = async (ctx, next) => {
  let span
  const transaction = ctx.__sentry_transaction
  if (transaction) {
    span = transaction.startChild({
      description: route,
      op: 'myMiddleware',
    })
  }
  await myExpensiveOperation()
  if (span) {
    span.finish()
  }
  return next()
}
```
