import qs from 'query-string';

const KEY = 'preferredPlatform';

// Get the object associated with a given platform slug.
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns an object or null if no platform matches the slug.
const getPlatformBySlug = function(slug) {
  return window.supportedPlatforms.find(p => p.slug === slug);
};

// Update UI state to show content for a given platform.
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns nothing.
const showPlatform = function(slug) {
  const platform = getPlatformBySlug(slug);
  if (!platform) return;

  const $contentBlocks = $('[data-platform-specific-content]');

  // Update UI
  $contentBlocks.each((i, el) => {
    const $block = $(el);
    // Update dropdown target title
    $block.find('[data-toggle="dropdown"]').text(platform.name);

    // Update active state of dropdown items
    const $dropdownItems = $block.find('[data-toggle="platform"]');
    $dropdownItems.each((i, el) => {
      const $el = $(el);
      const isActive = $el.attr('data-platform') === platform.slug;
      $el.toggleClass('active', isActive);
      $el.attr('aria-selected', isActive);
    });

    // Update the active state of the tab panes
    const $activeItem = $dropdownItems.filter('.active');
    const activeID = $activeItem.attr('href').replace('#', '');
    const $tabPanes = $block.find('.tab-pane');
    $tabPanes.each((i, el) => {
      const $el = $(el);
      const isActive = $el.attr('id') === activeID;
      $el.toggleClass('show active', isActive);
    });
  });
};

// Add the current platform to all links on the page.
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns nothing.
const addPlatformToLinks = function(slug) {
  const platform = getPlatformBySlug(slug);
  if (!platform) return;

  $('a').each((i, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    const isDocLink = /(^\/|docs.sentry.io)/.test(href);
    if (isDocLink) {
      const { url, query } = qs.parseUrl(href);
      query.platform = platform.slug;
      $el.attr('href', `${url}?${qs.stringify(query)}`);
    }
  });
};

// Attach event listeners and set UI state based on the platform supplied via
// query param, stored in localStorage as the preferred platform, or the
// default platform, in that order.
//
// Returns nothing.
const init = function() {
  $(document).on('click', '[data-toggle="platform"]', function(event) {
    event.preventDefault();
    const $target = $(event.target);
    const slug = $target.data('platform');
    localStorage.setItem(KEY, slug);
    showPlatform(slug);
  });

  const queryPlatform = qs.parse(location.search).platform;
  const preferredPlatform = localStorage.getItem(KEY);
  showPlatform(queryPlatform || preferredPlatform);
  addPlatformToLinks(queryPlatform);
};

export default { init };
