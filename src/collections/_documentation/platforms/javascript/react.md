---
title: React
sidebar_order: 30
---
<!-- WIZARD -->
To use Sentry with your React application, you will need to use `@sentry/browser` (Sentry’s browser JavaScript SDK).  
On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.

If you’re using React 16 or above, Error Boundaries are an important tool for defining the behavior of your application in the face of errors. Be sure to send errors they catch to Sentry using `Sentry.captureException`. This is also a great opportunity to collect user feedback by using `Sentry.showReportDialog`.

{% capture __alert_content -%}
One important thing to note about the behavior of error boundaries in development mode is that React will rethrow errors they catch. This will result in errors being reported twice to Sentry with the above setup, but this won’t occur in your production build.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

```jsx
import * as Sentry from '@sentry/browser';

// Sentry.init({
//  dsn: "___PUBLIC_DSN___"
// });
// should have been called before using it here
// ideally before even rendering your react app

class ExampleBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, eventId: null };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope(scope => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          this.setState({eventId})
      });
    }

    render() {
        if (this.state.error) {
            //render fallback UI
            return (
              <a onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</a>
            );
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}
```
<!-- ENDWIZARD -->
