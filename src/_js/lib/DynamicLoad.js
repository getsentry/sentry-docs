import { fullPath } from './Helpers';

const isDifferentDomain = function(here, there) {
  return here.protocol !== there.protocol || here.host !== there.host;
};

const isSamePage = function(here, there) {
  return (
    here.pathname.replace(/\/$/, '') === there.pathname.replace(/\/$/, '') &&
    here.host === there.host
  );
};

class DynamicLoad {
  constructor() {
    this.load = this.load.bind(this);
    this.linkClickHandler = this.linkClickHandler.bind(this);
    this.didUpdateHandler = this.didUpdateHandler.bind(this);
    this.registerHandlers = this.registerHandlers.bind(this);
    this.popstateHandler = this.popstateHandler.bind(this);
  }

  load(url, pushState) {
    $('body').addClass('loading');

    return $.ajax({ type: 'GET', url: fullPath(url) })
      .then(html => {
        // Expose the jQuery object via an event for pre-render manipulation
        const $page = $('<div/>').append(
          $(html.replace('<!DOCTYPE html>', ''))
        );

        $(document).trigger('page.willUpdate', $page);

        // Update the title
        const $title = $page.find('title').eq(0);
        $('title').text($title.text());

        // Update each dynamic section
        $page.find('[data-dynamic-load]').each(function(i, el) {
          const $el = $(el);
          const slug = $el.data('dynamic-load');
          const content = $el.html();
          $(`[data-dynamic-load="${slug}"]`).html(content);
        });

        if (pushState) {
          window.history.pushState(null, document.title, fullPath(url));
        }

        $('body').removeClass('loading');

        $(document).trigger('page.didUpdate');
      })
      .catch(error => {
        window.location = fullPath(url);
      });
  }

  linkClickHandler(event) {
    // if (event.test) console.log(event);
    switch (true) {
      // Just follow the default behavior in these scenarios
      case event.ctrlKey:
      case event.metaKey:
      case isDifferentDomain(window.location, event.currentTarget):
      case isSamePage(window.location, event.currentTarget):
        return Promise.resolve();
      // Load the content if this is a new page within the site.
      default:
        event.preventDefault();
        return this.load(event.currentTarget, true).then(() => {
          // Send reload a pageview
          window.ra.page();
        });
    }
  }

  didUpdateHandler(event) {
    // Handle vertical scroll position of new content
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const $el = $(hash).get(0);
      if ($el) $el.scrollIntoView();
    } else {
      $('.main-scroll').scrollTop(0);
    }

    // Collapse the mobile sidebar
    $('#sidebar').collapse('hide');
  }

  popstateHandler(event) {
    this.load(document.location);
  }

  registerHandlers() {
    $(document).on('click', '[data-dynamic-load] a', this.linkClickHandler);
    $(document).on('page.didUpdate', this.didUpdateHandler);
    $(window).on('popstate', this.popstateHandler);
  }
}

export default DynamicLoad;
