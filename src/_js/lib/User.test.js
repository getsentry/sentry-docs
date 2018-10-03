import User, { constructDSNObject, defaultProject } from './User';
import 'jest-localstorage-mock';

const sampleProject1 = {
  projectName: 'Test1',
  secretKey: 'test1',
  publicKey: 'test1',
  dsnPublic: 'https://test1@sentry.io/test1',
  id: 1,
  dsn: 'https://test1:test1@sentry.io/test1',
  organizationName: 'Test1',
  name: 'Test1',
  organizationId: 1,
  teamName: 'Test1',
  organizationSlug: 'test1',
  projectSlug: 'test1'
};

const sampleProject2 = {
  projectName: 'Test2',
  secretKey: 'test2',
  publicKey: 'test2',
  dsnPublic: 'https://test2@sentry.io/test2',
  id: 2,
  dsn: 'https://test2:test2@sentry.io/test2',
  organizationName: 'Test2',
  name: 'Test2',
  organizationId: 2,
  teamName: 'Test2',
  organizationSlug: 'test2',
  projectSlug: 'test2'
};

describe('User', function() {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    window.ra = {
      page: jest.fn(),
      identify: jest.fn()
    };
    window.amplitude = {
      getInstance: jest.fn(() => {
        return {
          logEvent: jest.fn(),
          setUserId: jest.fn()
        };
      })
    };
  });

  describe('.setUserData', () => {
    test('sets default values', () => {
      const user = new User();
      const data = user.setUserData();
      expect(data).toEqual(JSON.parse(localStorage.__STORE__[user.namespace]));
      expect(data).toMatchSnapshot();
    });

    test('sets new values', () => {
      const user = new User();
      const data = user.setUserData({
        preferred: sampleProject2,
        projects: [sampleProject1, sampleProject2]
      });
      expect(data).toMatchSnapshot();
    });

    test('picks a default preference', () => {
      const user = new User();
      const data = user.setUserData({
        projects: [sampleProject1, sampleProject2]
      });
      expect(data).toMatchSnapshot();
    });

    test('substitudes valid preferences', () => {
      const user = new User();
      const data = user.setUserData({
        preferred: sampleProject1,
        projects: [sampleProject2]
      });
      expect(data).toMatchSnapshot();
    });

    test('overwrites corrupt storage', () => {
      const user = new User();
      localStorage.__STORE__[user.namespace] = 'This should fail';
      const data = user.setUserData({
        preferred: sampleProject1,
        projects: [sampleProject2]
      });
      expect(data).toMatchSnapshot();
    });
  });

  describe('.getUserData', () => {
    test('has default values', () => {
      const user = new User();
      expect(user.getUserData()).toMatchSnapshot();
    });

    test('gets stored values', () => {
      const user = new User();
      user.setUserData({
        projects: [sampleProject1, sampleProject2]
      });
      expect(user.getUserData()).toMatchSnapshot();
    });
  });

  describe('constructDSNObject', () => {
    test('has default', () => {
      expect(constructDSNObject()).toMatchSnapshot();
    });

    test('works', () => {
      expect(constructDSNObject(sampleProject1)).toMatchSnapshot();
    });
  });

  describe('.init', () => {
    const authedUser = {
      user: {
        name: 'Test User',
        id: 1,
        isAuthenticated: true,
        avatarUrl: 'https://foo.bar.com'
      },
      projects: [sampleProject1, sampleProject2],
      api_keys: []
    };
    const noUser = {
      user: { isAuthenticated: false },
      projects: [],
      api_keys: []
    };

    beforeEach(() => {
      const $ = require('jquery');
      global.$ = $;

      $.ajax = jest.fn(() => {
        return Promise.resolve(authedUser);
      });
    });

    test('loads defaults without authed user', () => {
      const user = new User();

      $.ajax = jest.fn(() => {
        return Promise.resolve(noUser);
      });

      const updateMock = jest.fn();
      $(document).on('user.didUpdate', updateMock);

      return user.init().then(() => {
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(JSON.parse(localStorage.__STORE__[user.namespace])).toEqual({
          preferred: defaultProject,
          projects: [defaultProject]
        });
      });
    });

    test('loads authed user content', () => {
      const user = new User();

      const updateMock = jest.fn();
      $(document).on('user.didUpdate', updateMock);

      return user.init().then(() => {
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(JSON.parse(localStorage.__STORE__[user.namespace])).toEqual({
          preferred: sampleProject1,
          projects: [sampleProject1, sampleProject2]
        });
      });
    });

    test('handles server errors', () => {
      const user = new User();

      $.ajax = jest.fn(() => {
        return Promise.reject();
      });

      const updateMock = jest.fn();
      $(document).on('user.didUpdate', updateMock);

      return user.init().then(() => {
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(JSON.parse(localStorage.__STORE__[user.namespace])).toEqual({
          preferred: defaultProject,
          projects: [defaultProject]
        });
      });
    });

    test('loads from cache and updates', () => {
      const user = new User();

      localStorage.__STORE__[user.namespace] = JSON.stringify({
        preferred: sampleProject2,
        projects: [sampleProject1, sampleProject2]
      });

      const updateMock = jest.fn();
      $(document).on('user.didUpdate', updateMock);

      $.ajax = jest.fn(() => {
        const user = { ...authedUser };
        user.projects = [sampleProject1];
        return Promise.resolve(user);
      });

      return user.init().then(() => {
        expect(updateMock).toHaveBeenCalledTimes(2);
        expect(updateMock.mock.calls[0][1]).toEqual({
          preferred: constructDSNObject(sampleProject2),
          projects: [
            constructDSNObject(sampleProject1),
            constructDSNObject(sampleProject2)
          ]
        });
        expect(updateMock.mock.calls[1][1]).toEqual({
          preferred: constructDSNObject(sampleProject1),
          projects: [constructDSNObject(sampleProject1)]
        });
        expect(JSON.parse(localStorage.__STORE__[user.namespace])).toEqual({
          preferred: sampleProject1,
          projects: [sampleProject1]
        });
      });
    });
  });
});
