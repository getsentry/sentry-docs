import { fullPath } from './Helpers';

let currentPathName = document.location.pathname;

const replaceContent = function(html) {
  const $page = $(html.replace('<!DOCTYPE html>', ''));
  const $new = $page.find('[data-dynamic-load]');
  const $title = $page.filter('title').eq(0);
  $('head title').text($title.text());

  $new.each(function(i, el) {
    const $el = $(el);
    const slug = $el.data('dynamic-load');
    const content = $el.html();
    $(`[data-dynamic-load="${slug}"]`).html(content);
  });
};

const isSameDomain = function(here, there) {
  return here.protocol === there.protocol && here.host === there.host;
};

const defaultLoader = function(url) {
  if (url.pathname === currentPathName) return Promise.resolve();
  return $.ajax({ type: 'GET', url: fullPath(url) });
};

class DynamicLoader {
  constructor() {
    this.loaders = {};

    this.init = this.init.bind(this);
    this.addLoader = this.addLoader.bind(this);
    this.load = this.load.bind(this);
  }

  init() {
    $(document).on(
      'click',
      '[data-dynamic-load] a:not([data-not-dynamic])',
      event => {
        if (event.ctrlKey || event.metaKey) return;
        if (!isSameDomain(window.location, event.currentTarget)) return;
        event.preventDefault();
        this.load(event.currentTarget, true);
      }
    );

    $(window).on('popstate', event => {
      const { pathname, hash, search } = document.location;
      this.load({ pathname, hash, search }, false);
    });
  }

  addLoader(path, handler) {
    this.loaders[path] = handler;
  }

  load(url, pushState) {
    const keys = Object.keys(this.loaders);
    let matched = false;
    let i = 0;
    let loader = defaultLoader;

    while (i < keys.length && !matched) {
      const pathTest = keys[i];
      matched = new RegExp(pathTest, 'i').test(fullPath(url));
      if (matched) loader = this.loaders[pathTest];
      i++;
    }

    const { pathname, hash, search } = url;
    const done = function() {
      // Send reload a pageview if this is a new page
      if (pathname !== location.pathname) window.ra.page();

      // Update history if necessary
      if (pushState) {
        window.history.pushState(null, document.title, fullPath(url));
      }

      // Handle vertical scroll position of new content
      if (hash) {
        const $el = $(hash).get(0);
        if ($el) $el.scrollIntoView();
      } else {
        $('.main-scroll').scrollTop(0);
      }

      currentPathName = pathname;
      $('#sidebar').collapse('hide');
      $(document).trigger('page.didUpdate');
    };

    $('body').addClass('loading');
    loader({ pathname, hash, search })
      .then(html => {
        $('body').removeClass('loading');
        if (html) replaceContent(html);
        done();
      })
      .catch(error => {
        window.location = fullPath(url);
      });
  }
}

export default new DynamicLoader();
