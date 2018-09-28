import URL from 'url-parse';
import pretty from 'pretty';
import Constructor from './DynamicLoad';

const newPage = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <title>This is a new document</title>
  </head>

  <body>
    <div data-dynamic-load="test">
      <p>This is new document content</p>
    </div>
  </body>

  </html>
`;

describe('DynamicLoad', function() {
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    jest.restoreAllMocks();

    window.history.pushState({}, 'Test Title', '/');

    const $ = require('jquery');
    global.$ = $;

    $.ajax = jest.fn(() => {
      return Promise.resolve(newPage);
    });

    window.ra = { page: jest.fn() };

    document.body.innerHTML = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <title>Test Document</title>
    </head>

    <body>
      <div data-dynamic-load="test">
        <p>This is the original document</p>

        <a href="/new-document/" id="new-document"></a>
        <a href="#test" id="same-page"></a>
        <a href="https://new.site.com" id="external-page"></a>
      </div>
    </body>

    </html>
    `;
  });

  describe('.load()', () => {
    test('displays loading state', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(3);
      const runner = DynamicLoad.load(
        new URL('https://docs.sentry.io/new-doc')
      ).then(() => {
        expect($('body').hasClass('loading')).toBe(false);
        expect($.ajax.mock.calls).toMatchSnapshot();
      });
      expect($('body').hasClass('loading')).toBe(true);
      return runner;
    });

    test('replaces fetched content', done => {
      const DynamicLoad = new Constructor();
      expect.assertions(2);
      $(document).on('page.didUpdate', function() {
        expect($('title').text()).toBe('This is a new document');
        expect(pretty($('body').html())).toMatchSnapshot();
        done();
      });
      DynamicLoad.registerHandlers();
      $('#new-document').click();
    });

    test('does not update history by default', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(1);
      jest.spyOn(window.history, 'pushState');
      const runner = DynamicLoad.load(
        new URL('https://docs.sentry.io/new-doc')
      ).then(() => {
        expect(window.history.pushState.mock.calls).toHaveLength(0);
      });
      return runner;
    });

    test('updates history when told to', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(1);
      jest.spyOn(window.history, 'pushState');
      const runner = DynamicLoad.load(
        new URL('https://docs.sentry.io/new-doc'),
        true
      ).then(() => {
        expect(window.history.pushState.mock.calls).toMatchSnapshot();
      });
      return runner;
    });

    test('triggers page.willUpdate and page.didUpdate', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(4);
      const handler = jest.fn();
      $(document).on('page.willUpdate page.didUpdate', handler);

      const runner = DynamicLoad.load(
        new URL('https://docs.sentry.io/new-doc'),
        true
      ).then(() => {
        expect(handler.mock.calls[0][0].type).toBe('page');
        expect(handler.mock.calls[0][0].namespace).toBe('willUpdate');
        expect(handler.mock.calls[1][0].type).toBe('page');
        expect(handler.mock.calls[1][0].namespace).toBe('didUpdate');
      });
      return runner;
    });
  });

  describe('.linkClickHandler()', () => {
    test('prevents default and loads page', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(2);
      const preventDefault = jest.fn();
      jest.spyOn(DynamicLoad, 'load');
      const runner = DynamicLoad.linkClickHandler({
        currentTarget: new URL('https://docs.sentry.io/new-doc'),
        preventDefault,
        test: 'true'
      }).then(() => {
        expect(DynamicLoad.load).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
      });
      return runner;
    });

    test('ignores control key clicks', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(1);
      DynamicLoad.load = jest.fn(() => Promise.resolve());
      DynamicLoad.registerHandlers();
      $('#new-document').click({ ctrlKey: true });
      expect(DynamicLoad.load).not.toHaveBeenCalled();
    });

    test('ignores meta key clicks', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(1);
      DynamicLoad.load = jest.fn(() => Promise.resolve());
      DynamicLoad.registerHandlers();
      $('#new-document').click({ metaKey: true });
      expect(DynamicLoad.load).not.toHaveBeenCalled();
    });

    test('ignores external domain links', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(1);
      DynamicLoad.load = jest.fn(() => Promise.resolve());
      DynamicLoad.registerHandlers();
      $('#external-page').click();
      expect(DynamicLoad.load).not.toHaveBeenCalled();
    });

    test('ignores same page links', () => {
      const DynamicLoad = new Constructor();
      expect.assertions(1);
      DynamicLoad.load = jest.fn(() => Promise.resolve());
      DynamicLoad.registerHandlers();
      $('#same-page').click();
      expect(DynamicLoad.load).not.toHaveBeenCalled();
    });
  });

  describe('.popstateHandler()', () => {
    test('loads without pushState', () => {
      const DynamicLoad = new Constructor();
      DynamicLoad.load = jest.fn(() => {
        return Promise.resolve();
      });
      DynamicLoad.registerHandlers();
      dispatchEvent(new PopStateEvent('popstate', {}));
      expect(DynamicLoad.load).toHaveBeenCalled();
      expect(DynamicLoad.load.mock.calls[0][1]).toBeFalsy();
      DynamicLoad.load.mockRestore();
    });
  });
});
