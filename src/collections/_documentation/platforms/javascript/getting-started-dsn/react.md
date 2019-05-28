You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing React:

```jsx
import React from 'react';
import * as Sentry from '@sentry/browser';
import App from 'src/App';

Sentry.init({dsn: "___PUBLIC_DSN___"});

ReactDOM.render(<App />, document.getElementById('root'));
```
