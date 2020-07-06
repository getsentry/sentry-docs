
**React**

To get started with performance monitoring using Sentry's React SDK, first install the `@sentry/react` and `@sentry/apm` packages:

```bash
# Using yarn
$ yarn add @sentry/react @sentry/apm

# Using npm
$ npm install @sentry/react @sentry/apm
```

Next, initialize the integration in your call to `Sentry.init`. Make sure this happens before you mount your React component on the page.

```jsx
import * as Sentry from '@sentry/react';
import { Integrations } from "@sentry/apm";
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  release: 'my-project-name@' + process.env.npm_package_version,
  integrations: [
    new Integrations.Tracing(),
  ],
  tracesSampleRate: 0.25, // must be present and non-zero
});

// ...

ReactDOM.render(<App />, rootNode);

// Can also use with React Concurrent Mode
// ReactDOM.createRoot(rootNode).render(<App />);
```

**`withProfiler` Higher-Order Component**

`@sentry/react` exports a `withProfiler` higher-order component that leverages the `@sentry/apm` Tracing integration to add React related spans to transactions. If the Tracing integration is not enabled, the Profiler will not work.

In the example below, the `withProfiler` higher-order component is used to instrument an App component.

```jsx
import React from 'react';
import * as Sentry from '@sentry/react';

class App extends React.Component {
  render() {
    return (
      <FancyComponent>
        <NestedComponent someProp={2} />
        <AnotherComponent />
      </FancyComponent>
    )
  }
}

export default Sentry.withProfiler(App);
```

The React Profiler currently generates spans with three different kinds of op-codes: `react.mount`, `react.render`, and `react.update`.

`react.mount`

: The span that represents how long it took for the profiled component to mount.

`react.render`

: The span that represents how long the profiled component was on a page. This span is only generated if the profiled component mounts and unmounts while a transaction is occurring.

`react.update`

: The span that represents when the profiled component updated. This span is only generated if the profiled component has mounted.

{% capture __alert_content -%}
In [React Strict Mode](https://reactjs.org/docs/strict-mode.html), certain component methods will be [invoked twice](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects). This may lead to duplicate `react.mount` spans appearing in a transaction. React Strict Mode only runs in development mode, so this will have no impact on your production traces.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

The `withProfiler` higher-order component has a variety of options for further customization. They can be passed in as the second argument to the `withProfiler` function.

```jsx
export default Sentry.withProfiler(App, { name: "CustomAppName" })
```

`name` (string)

: The name of the component being profiled. By default, the name is taken from the component `displayName` property or the component `name` property.

`includeRender` (boolean)

: If a `react.render` span should be created by the Profiler. Set as true by default.

`includeUpdates` (boolean)

: If `react.update` spans should be created by the Profiler. Set as true by default. We recommend setting this prop as false for components that will experience many rerenders, such as text input components, as the resulting spans can be very noisy.
