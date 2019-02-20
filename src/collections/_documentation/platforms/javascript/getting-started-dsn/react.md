<!-- WIZARD -->
If you’re using React 16 or above, Error Boundaries are an important tool for defining the behavior of your application in the face of errors. Be sure to send errors they catch to Sentry using `Sentry.captureException`, and optionally this is also a great opportunity to surface User Feedback.

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
        this.state = { error: null };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    }

    render() {
        if (this.state.error) {
            //render fallback UI
            return (
              <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
            );
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}
```
<!-- ENDWIZARD -->