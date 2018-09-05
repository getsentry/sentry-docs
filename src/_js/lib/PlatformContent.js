import qs from 'query-string';

const KEY = 'preferredPlatform';

// Get the object associated with a given platform slug.
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns an object or null if no platform matches the slug.
const verifyPlatformSlug = function(slug) {
  return window.supportedPlatforms.find(x => x === slug);
};

// Update the url of hte page to reflect a current slug
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns nothing.
const updateLocationPlatform = function(slug) {
  history.replaceState({}, '', updateUrlPlatform(location.href, slug));
};

// Add or update the platform slug of a url
//
//  url  - a url string
//  slug - slug matching a platform in data/platforms.yml
//
// Returns a string
const updateUrlPlatform = function(url, slug) {
  const { url: origin, query } = qs.parseUrl(url);
  query.platform = slug;
  return `${origin}?${qs.stringify(query)}`;
};

const initRelatedElements = function() {
  $('.config-key').each(function() {
    this.setAttribute('data-config-key', $(this).text());
  });

  $('.unsupported').each(function() {
    $('<div class="unsupported-hint"></div>').prependTo(this);
  });
};

const syncRelatedElements = function() {
  let platform = window.platformData[window.activePlatform];
  let style = platform && platform.case_style || 'canonical';

  $('.config-key').each(function() {
    let canonical = this.getAttribute('data-config-key');
    let intended = canonical;
    switch (style) {
      case 'snake_case': intended = canonical.replace(/-/g, '_'); break;
      case 'camelCase': intended = canonical.split(/-/g).map((val, idx) =>
        idx == 0 ? val : val.charAt(0).toUpperCase() + val.substr(1)
      ).join(''); break;
      case 'PascalCase': intended = canonical.split(/-/g).map((val) =>
        val.charAt(0).toUpperCase() + val.substr(1)
      ).join(''); break;
    }
    let elements = $(this).children();
    $(this).text(intended).prepend(elements);
  });

  $('.unsupported').each(function() {
    let slugs = this.getAttribute('data-unsupported-platforms');
    let inverse = false;
    if (!slugs) {
      slugs = this.getAttribute('data-supported-platforms');
      inverse = true;
    }
    slugs = slugs.split(/\s+/g);
    if ((slugs.indexOf(window.activePlatform) >= 0) != inverse) {
      $(this).addClass('is-unsupported');
      $('div.unsupported-hint', this).text(`Not available for ${platform.name || 'this platform'}.`);
    } else {
      $(this).removeClass('is-unsupported');
    }
  });
};

// Update UI state to show content for a given platform. If the platform does
// not exist,
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns nothing.
const showPlatform = function(slug) {
  if (!verifyPlatformSlug(slug)) return;

  window.activePlatform = slug;
  let platform = window.platformData[window.activePlatform];

  $('[data-platform-specific-content]').each((i, el) => {
    const $block = $(el);
    let $dropdownItems;
    let $requested;
    let $preferred;
    let $active;
    const slugs = [slug, platform.fallback_platform];
    for (const index in slugs) {
      $dropdownItems = $block.find('[data-toggle="platform"]');
      $requested = $dropdownItems.filter(`[data-platform="${slugs[index]}"]`);
      $preferred = $dropdownItems.filter(
        `[data-platform="${localStorage.getItem(KEY)}"]`
      );
      $active = $requested;
      if ($active.length) {
        // We skip and don't use fallback platform
        break;
      }
    }
    if (!$active.length) {
      $active = $preferred.length ? $preferred : $dropdownItems.eq(0);
    }

    // Updat the active state of the dropdown items
    $dropdownItems.removeClass('active');
    $dropdownItems.attr('aria-selected', false);
    $active.addClass('active');
    $active.attr('aria-selected', true);

    // Update the active state of the tab panes
    const $activeItem = $dropdownItems.filter('.active');
    const activeID = $active.attr('href').replace('#', '');
    const $tabPanes = $block.find('.tab-pane');
    const $activePane = $tabPanes.filter(`#${activeID}`);
    $tabPanes.removeClass('show active');
    $activePane.addClass('show active');

    // Update dropdown target title
    $block.find('[data-toggle="dropdown"]').text($active.text());
  });

  syncRelatedElements();
};

// Add the current platform to all links on the page.
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns nothing.
const addPlatformToLinks = function(slug) {
  const validSlug = verifyPlatformSlug(slug);
  if (!validSlug) return;

  $('a').each((i, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    const isDocLink = /(^\/|docs.sentry.io)/.test(href);
    if (isDocLink) $el.attr('href', updateUrlPlatform(href, validSlug));
  });
};

// Attach event listeners and set UI state based on the platform supplied via
// query param, stored in localStorage as the preferred platform, or the
// default platform, in that order.
//
// Returns nothing.
const init = function() {
  initRelatedElements();

  $(document).on('click', '[data-toggle="platform"]', function(event) {
    event.preventDefault();
    const $target = $(event.target);
    const slug = $target.data('platform');
    localStorage.setItem(KEY, slug);
    showPlatform(slug);
    addPlatformToLinks(slug);
    updateLocationPlatform(slug);
  });

  $(document).on('page.didUpdate', function(event) {
    const queryPlatform = qs.parse(location.search).platform;
    const preferredPlatform = localStorage.getItem(KEY);
    showPlatform(queryPlatform || preferredPlatform);
    addPlatformToLinks(queryPlatform);
  });
};

export default { init };
