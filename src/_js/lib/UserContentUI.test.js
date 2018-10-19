import UserContentUI, { init } from './UserContentUI';
import User from './User';
import 'jest-localstorage-mock';

const MOCK_HTML = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <title>This is a new document</title>
  </head>

  <body>
    <main>
      <div data-hide-when-logged-in>This should be hidden after page load</div>
      <pre><code>This is a basic example: ___PUBLIC_DSN___</code></pre>
      <pre><code>This example should not be wrapped</pre>
    </main>
  </body>

  </html>
`;

const sampleProject1 = {
  id: 1,
  group: 'test1',
  PROJECT_NAME: 'test1',
  PROJECT_ID: '1',
  ORG_NAME: 'test1',
  DSN: 'https://test1:test1@sentry.io/test1',
  PUBLIC_DSN: 'https://test1@sentry.io/test1',
  PUBLIC_KEY: 'test1',
  SECRET_KEY: 'test1',
  API_URL: 'https://sentry.io/api',
  MINIDUMP_URL: 'https://sentry.io/api/test1/minidump?sentry_key=test1'
};

const sampleProject2 = {
  id: 2,
  group: 'test1',
  PROJECT_NAME: 'test2',
  PROJECT_ID: '2',
  ORG_NAME: 'test2',
  DSN: 'https://test2:test2@sentry.io/test2',
  PUBLIC_DSN: 'https://test2@sentry.io/test2',
  PUBLIC_KEY: 'test2',
  SECRET_KEY: 'test2',
  API_URL: 'https://sentry.io/api',
  MINIDUMP_URL: 'https://sentry.io/api/test2/minidump?sentry_key=test2'
};

const sampleUser = {
  name: 'Test User',
  id: 1,
  isAuthenticated: true,
  avatarUrl: 'https://foo.bar.com'
};

describe('UserContentUI', function() {
  beforeEach(() => {
    const $ = require('jquery');
    global.$ = $;
    document.body.innerHTML = MOCK_HTML;
    global.User = new User();
    global.User.init();
  });

  describe('.init', () => {
    test('hide-when-logged-in', () => {
      expect($('[data-hide-when-logged-in]').attr('class')).toBe(undefined);
      UserContentUI.init();
      expect($('[data-hide-when-logged-in]').attr('class')).toBe('d-none');
    });

    test('user.didUpdate', () => {
      UserContentUI.init();
      $(document).trigger('user.didUpdate', [
        {
          preferred: sampleProject2,
          projects: [sampleProject1, sampleProject2]
        }
      ]);
      expect($('body').html()).toMatchSnapshot();
    });

    test('clicks on new projects switch the project', () => {
      UserContentUI.init();
      global.User.setPreference = jest.fn();
      $(document).trigger('user.didUpdate', [
        {
          preferred: sampleProject2,
          projects: [sampleProject1, sampleProject2]
        }
      ]);
      expect($('body').html()).toMatchSnapshot();
      $('.dropdown-item[data-id="1"]').click();
      expect(global.User.setPreference).toHaveBeenCalledWith(1);
    });

    test('rewraps after page update', () => {
      UserContentUI.init();
      global.User.setPreference = jest.fn();
      $(document).trigger('user.didUpdate', [
        {
          preferred: sampleProject2,
          projects: [sampleProject1, sampleProject2]
        }
      ]);
      document.body.innerHTML = MOCK_HTML;
      expect($('body').html()).toMatchSnapshot();
      $(document).trigger('page.didUpdate');
      expect($('body').html()).toMatchSnapshot();
    });
  });
});
