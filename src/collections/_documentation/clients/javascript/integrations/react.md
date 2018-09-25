---
title: React
sidebar_order: 10
---

<!-- WIZARD -->
## Installation

Start by adding the `raven.js` script tag to your page. It should be loaded as early as possible, before your main javascript bundle.

```html
<script src="https://cdn.ravenjs.com/3.26.4/raven.min.js"
    crossorigin="anonymous"></script>
```

## Configuring the Client

Next configure Raven.js to use your Sentry DSN:

```javascript
Raven.config('___PUBLIC_DSN___').install()
```

At this point, Raven is ready to capture any uncaught exception.
<!-- ENDWIZARD -->
## Expanded Usage

If you’re using React 16 or above, [Error Boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html) are an important tool for defining the behavior of your application in the face of errors. Be sure to send errors they catch to Sentry using `Raven.captureException`, and optionally this is also a great opportunity to surface [User Feedback]({%- link _documentation/learn/user-feedback.md -%})

```jsx
class ExampleBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Raven.captureException(error, { extra: errorInfo });
    }

    render() {
        if (this.state.error) {
            //render fallback UI
            return (
                <div
                className="snap"
                onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
                    <img src={oops} />
                    <p>We're sorry — something's gone wrong.</p>
                    <p>Our team has been notified, but click here fill out a report.</p>
                </div>
            );
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}
```

```html
<div>
    <ExampleBoundary>
        <h2>Sidebar</h2>
        <Widget/>
    </ExampleBoundary>
    <p> This content won't unmount when Widget throws. </p>
</div>
```

One important thing to note about the behavior of error boundaries in development mode is that React will rethrow errors they catch. This will result in errors being reported twice to Sentry with the above setup, but this won’t occur in your production build.

Read more about error boundaries [in this blog post](https://blog.sentry.io/2017/09/28/react-16-error-boundaries).

## Redux

If you use [Redux](https://github.com/reactjs/redux) there are some useful community maintained middleware packages for annotating error reports with useful information, such as store state and recent actions:

-   [captbaritone/raven-for-redux](https://github.com/captbaritone/raven-for-redux)
-   [ngokevin/redux-raven-middleware](https://github.com/ngokevin/redux-raven-middleware)

## Redux Sagas Middleware

If you’re using [Redux Saga](https://github.com/redux-saga/redux-saga) be aware that it does not bubble errors up to the browsers uncaught exception handler.

You may specify an error handler that captures saga exceptions by passing an `onError` function to the `createSagaMiddleware` options, and call `Raven.captureException` inside that callback. See the [Redux Saga documentation](https://redux-saga.js.org/docs/api/#createsagamiddlewareoptions) for more details.
