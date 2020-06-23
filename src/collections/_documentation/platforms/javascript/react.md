---
title: React
sidebar_order: 30
keywords: ["reactjs"]
---
<!-- WIZARD -->
To use Sentry with your React application, you will need to use `@sentry/react` (Sentry’s Browser React SDK).

{% capture __alert_content -%}
`@sentry/react` is a is a wrapper around the `@sentry/browser` package, with added functionality related to React. All methods available in the `@sentry/browser` package also can also be imported from `@sentry/react`.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

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

If you’re using React 16 or above, Error Boundaries are an important tool for defining the behavior of your application in the face of errors. The `@sentry/react` package exposes an error boundary component that automatically sends Javascript errors from inside a React component tree to Sentry.

{% capture __alert_content -%}
In development mode, React will rethrow errors caught within an error boundary. This will result in errors being reported twice to Sentry with the above setup, but this won’t occur in your production build.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

In the example below, when the `<Example />` component hits an error, the `<Sentry.ErrorBoundary>` component will send data about that error and the component tree to Sentry, and open a user feedback dialog, and render a fallback UI.

```jsx
import React from 'react';
import * as Sentry from '@sentry/react';

import {Example} from '../example';

function FallbackComponent() {
  return (
    <div>An error has occured</div>
  )
}

class App extends React.Component {
  render() {
    return (
      <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
        <Example />
      </Sentry.ErrorBoundary>
    )
  }
}

export default App;
```

#### Configuration

The ErrorBoundary component exposes a props that can be passed in for extra confugration

```ts
/** If a Sentry report dialog should be rendered on error */
  showDialog?: boolean;
  /**
   * Options to be passed into the Sentry report dialog.
   * No-op if {@link showDialog} is false.
   */
  dialogOptions?: Sentry.ReportDialogOptions;
  // tslint:disable no-null-undefined-union
  /**
   * A fallback component that gets rendered when the error boundary encounters an error.
   *
   * Can either provide a React Component, or a function that returns React Component as
   * a valid fallback prop. If a function is provided, the function will be called with
   * the error, the component stack, and an function that resets the error boundary on error.
   *
   */
  fallback?: React.ReactNode | FallbackRender;
  // tslint:enable no-null-undefined-union
  /** Called with the error boundary encounters an error */
  onError?(error: Error, componentStack: string): void;
  /** Called on componentDidMount() */
  onMount?(): void;
  /** Called if resetError() is called from the fallback render props function  */
  onReset?(error: Error | null, componentStack: string | null): void;
  /** Called on componentWillUnmount() */
  onUnmount?(error: Error | null, componentStack: string | null): void;
```
