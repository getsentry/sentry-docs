You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing React:

```jsx
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: '___PUBLIC_DSN___' });

ReactDOM.render(</App>, document.querySelector('#app'));
```
