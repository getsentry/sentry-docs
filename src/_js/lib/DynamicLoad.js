import { fullPath } from './Helpers';

const isDifferentDomain = function(here, there) {
  return here.protocol !== there.protocol || here.host !== there.host;
};

const isSamePage = function(here, there) {
  return here.pathname === there.pathname && here.host === there.host;
};

const load = function(url, pushState) {
  $('body').addClass('loading');

  $.ajax({ type: 'GET', url: fullPath(url) })
    .then(html => {
      // Expose the jQuery object via an event for pre-render manipulation
      const $page = $(html.replace('<!DOCTYPE html>', ''));
      $(document).trigger('page.willUpdate', $page);

      // Update the title
      const $title = $page.filter('title').eq(0);
      $('head title').text($title.text());

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
};

$(document).on('click', '[data-dynamic-load] a', function(event) {
  switch (true) {
    // Just follow the default behavior in these scenarios
    case event.ctrlKey:
    case event.metaKey:
    case isDifferentDomain(window.location, event.currentTarget):
    case isSamePage(window.location, event.currentTarget):
      return;
    // Load the content if this is a new page within the site.
    default:
      event.preventDefault();
      load(event.currentTarget, true);
      // Send reload a pageview
      window.ra.page();
  }
});

$(window).on('popstate', event => {
  load(document.location);
});

$(document).on('page.didUpdate', function(event) {
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
});
