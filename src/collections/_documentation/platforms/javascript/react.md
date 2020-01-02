---
title: React
sidebar_order: 30
keywords: ["reactjs"]
---
<!-- WIZARD -->
To use Sentry with your React application, you will need to use `@sentry/browser` (Sentry’s browser JavaScript SDK).

{% include_relative getting-started-install/react.md %}

### Connecting the SDK to Sentry

After you've completed setting up a project in Sentry, Sentry will give you a value which we call a _DSN_ or _Data Source Name_. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

{% include_relative getting-started-dsn/react.md %}

On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button:

```jsx
return <button onClick={methodDoesNotExist}>Break the world</button>;
```
<!-- ENDWIZARD -->

### Error Boundaries

If you’re using React 16 or above, Error Boundaries are an important tool for defining the behavior of your application in the face of errors. Be sure to send errors they catch to Sentry using `Sentry.captureException`. This is also a great opportunity to collect user feedback by using `Sentry.showReportDialog`.

{% capture __alert_content -%}
In development mode, React will rethrow errors caught within an error boundary. This will result in errors being reported twice to Sentry with the above setup, but this won’t occur in your production build.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

```jsx
import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

class ExampleBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { eventId: null };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      Sentry.withScope((scope) => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          this.setState({eventId});
      });
    }

    render() {
        if (this.state.hasError) {
            //render fallback UI
            return (
              <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
            );
        }

        //when there's not an error, render children untouched
        return this.props.children;
    }
}

export default ExampleBoundary
```
