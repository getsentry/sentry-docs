You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing React:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import App from './App';

Sentry.init({dsn: "___PUBLIC_DSN___"});

ReactDOM.render(<App />, document.getElementById('root'));
```
