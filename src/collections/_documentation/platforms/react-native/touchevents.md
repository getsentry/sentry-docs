---
title: 'Tracking Touch Events'
---

{% version_added 1.5.0 %}

To track touch events with the React Native SDK, you will need at least version `1.5.0` and will have to wrap your app with a `TouchEventBoundary`. You can track touch events in two ways:

## Wrapping with `TouchEventBoundary`
At the root of your app, usually `App.js`, wrap the app component with `Sentry.TouchEventBoundary`:

```jsx
import * as Sentry from "@sentry/react-native";

const App = () => {
    return (
        <Sentry.TouchEventBoundary>
            <RestOfTheApp />
        </Sentry.TouchEventBoundary>
    );
}

export default AppRegistry.registerComponent("Your Amazing App", () => App);;
```

## Using the `withTouchEventBoundary` Higher-Order Component

At the root of your app, usually `App.js`, wrap the app component with `Sentry.withTouchEventBoundary`:

```jsx
import * as Sentry from "@sentry/react-native";

const App = () => {
    return (
        <RestOfTheApp />
    );
}

export default AppRegistry.registerComponent("Your Amazing App", () => Sentry.withTouchEventBoundary(App));;
```

{% capture __alert_content -%}
While you can track specific sections of your app by wrapping each section with the boundary, do not nest them or the touches could be tracked multiple times along with possible undefined behavior.
{%- endcapture -%}
{%- include components/alert.html
  title="Multiple Boundaries"
  content=__alert_content
  level="warning"
  deep_link="multiple-boundaries"
%}

## How Touches are Tracked Automatically
Each touch event that occurs will be automatically logged as a breadcrumb, and will be displayed on the dashboard when an event occurs along with the component tree that the touch event occurred in. This component tree is logged using the `name` property of a component. By default, React Native will set this property automatically on components.

## Tracking Specific Components
You can let Sentry know which components to specifically track by setting the `displayName` property on them. If Sentry detects a component with a `displayName` within a touch's component tree, it will be logged nicely on the dashboard as having occurred in that component.
```jsx
class YourCoolComponent extends React.Component {
    static displayName = "CoolComponent";
    render() {
        return (
            <View>
                {/* ... */}
            </View>
        )
    }
}
```
or
```jsx
const YourCoolComponent = (props) => {
    return (
        <View>
            {/* ... */}
        </View>
    )
}

YourCoolComponent.displayName = "CoolComponent";
```

## Options

You can pass specific options to configure the boundary either as props to the `Sentry.TouchEventBoundary` component or as the second argument to the `Sentry.withTouchEventBoundary` higher-order component (HOC).

```jsx
(
    <Sentry.TouchEventBoundary ignoredDisplayNames={["BadComponent", "IgnoredComponent"]} >
        <RestOfTheApp />
    </Sentry.TouchEventBoundary>
)
```

```jsx
Sentry.withTouchEventBoundary(App, { maxComponentTreeSize: 15 })
```

### `breadcrumbCategory`
`string`

The category assigned to the breadcrumb that is logged by the touch event.

### `breadcrumbType`
`string`

The type assigned to the breadcrumb that is logged by the touch event.

### `maxComponentTreeSize`
`number`

The max number/depth of components to display when logging a touch's component tree. The default is 20.

### `ignoredDisplayNames`
`string[]`

Component `displayName`(s) to ignore when logging the touch event. This prevents unhelpful logs such as "Touch event within element: View" where you still can't tell which `View` it occurred in. By default, only `View` and `Text` are ignored. If you use this option, don't forget to include them.
