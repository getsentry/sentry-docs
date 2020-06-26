---
title: React
sidebar_order: 30
keywords: ["reactjs"]
---
<!-- WIZARD -->
To use Sentry with your React application, you will need to use `@sentry/react` (Sentry’s Browser React SDK).

{% capture __alert_content -%}
`@sentry/react` is a wrapper around the `@sentry/browser` package, with added functionality related to React. All methods available in the `@sentry/browser` package can also be imported from `@sentry/react`.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

{% include_relative getting-started-install/react.md %}

## Connecting the SDK to Sentry

After you've completed setting up a project in Sentry, Sentry will give you a value which we call a _DSN_ or _Data Source Name_. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

{% include_relative getting-started-dsn/react.md %}

On its own, `@sentry/react` will report any uncaught exceptions triggered by your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button:

```jsx
return <button onClick={methodDoesNotExist}>Break the world</button>;
```
<!-- ENDWIZARD -->

## Error Boundaries

If you're using React 16 or above, Error Boundaries are an essential tool for defining your application's behavior in the face of errors. The `@sentry/react` package exposes an error boundary component that automatically sends JavaScript errors from inside a React component tree to Sentry.

{% capture __alert_content -%}
In development mode, React will rethrow errors caught within an error boundary. This will result in errors being reported twice to Sentry with the above setup, but this won’t occur in your production build.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

In the example below, when the `<Example />` component hits an error, the `<Sentry.ErrorBoundary>` component will send data about that error and the component tree to Sentry, open a user feedback dialog, and render a fallback UI.

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

### ErrorBoundary Options

The ErrorBoundary component exposes a variety of props that can be passed in for extra configuration. There are no required options, but we highly recommend that you set a fallback component.

#### `showDialog` (boolean)

If a [Sentry User Feedback Widget]({%- link _documentation/enriching-error-data/user-feedback.md -%}?platform={{ include.platform }}) should be rendered when the Error Boundary catches an error.

#### `dialogOptions` (Object)

Options that are passed into the Sentry User Feedback Widget. See all possible customization options [here]({%- link _documentation/enriching-error-data/user-feedback.md -%}?platform={{ include.platform }}#customizing-the-widget)

#### `fallback` (React.ReactNode or Function)

A fallback component that gets rendered when the error boundary encounters an error. You can can either provide a React Component, or a function that returns a React Component as a valid fallback prop. If you provide a function, Sentry will call the function with the error and the component stack at the time of the error.

#### `onError` (Function)

A function that gets called when the Error Boundary encounters an error. `onError` is useful if you want to propagate the error into a state management library like Redux, or if you want to check any side effects that could have occurred due to the error.

#### `onMount` (Function)

A function that gets called on ErrorBoundary `componentDidMount()`

#### `onUnmount` (Function)

A function that gets called on ErrorBoundary `componentWillUnmount()`

### ErrorBoundary Usage

#### Setting a Fallback Function (Render Props)

Below is an example where a fallback prop, using the [render props approach](https://reactjs.org/docs/render-props.html), is used to display a fallback UI on error, and gracefully return to a standard component state when reset.

```jsx
import React from 'react';
import * as Sentry from '@sentry/react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "This is my app",
    };
  }

  render() {
    return (
      <Sentry.ErrorBoundary fallback={({ error, componentStack, resetError }) => (
          <React.Fragment>
            <div>You have encountered an error</div>
            <div>{error.toString()}</div>
            <div>{componentStack}</div>
            <button
              onClick={() => {
                this.setState({ message: "This is my app" });
                resetError();
              }}
            >
              Click here to reset!
            </button>
          </React.Fragment>
        )}>
        <div>{this.state.message}</div>
        {/* on click, this button sets an Object as a message, not a string. */}
        {/* which will cause an error to occur in the component tree */}
        <button onClick={() => this.setState({ message: {text: "Hello World"} })}>Click here to change message!</button>
      </Sentry.ErrorBoundary>
    )
  }
}

export default App;
```
