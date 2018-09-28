import qs from 'query-string';

const DEFAULT_PLATFORM = 'javascript';
const KEY = 'preferredPlatform';

// Platform display priority:
//
// - `platform` in url
// - `preferredPlatform` in localStorage
// - default platform
//
// `preferredPlatform` will update when:
//
// - `platform` in url is specified
// - A new platform is selected in the UI
//
// platform displayed may be forced by:
//
// - setting the `platform` in the url

// Get the slug for the platform that should be displayed
//
// Returns a String.
const getPlatformSlug = function() {
  return localStorage.getItem(KEY) || DEFAULT_PLATFORM;
};

// Get the object associated with a given platform slug.
//
//  slug - slug matching a platform in data/platforms.yml
//
// Returns an object or null if no platform matches the slug.
const verifyPlatformSlug = function(slug) {
  if (!slug) return false;
  return window.supportedPlatforms.find(x => x === slug);
};

// Add or update the platform slug of a url
//
//  url  - a url string
//  slug - slug matching a platform in data/platforms.yml
//
// Returns a string
const updateUrlPlatform = function(url, slug) {
  const url_split = url.split("#");
  const { url: path, query } = qs.parseUrl(url_split[0]);
  query.platform = slug;
  const hash = url_split[1] ? `#${url_split[1]}` : "";
  return `${path}?${qs.stringify(query)}${hash}`;
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
  if (verifyPlatformSlug(slug)) localStorage.setItem(KEY, slug);
  slug = getPlatformSlug();

  window.activePlatform = slug;
  let platform = window.platformData[window.activePlatform];

  $('[data-platform-specific-content]').each((i, el) => {
    const $block = $(el);
    let $dropdownItems = $block.find('[data-toggle="platform"]');
    let $preferred = $dropdownItems.filter(`[data-platform="${slug}"]`);
    let $active;

    const slugs = [slug, platform.fallback_platform];

    for (const index in slugs) {
      $active = $dropdownItems.filter(`[data-platform="${slugs[index]}"]`);
      if ($active.length) {
        if (index > 0) { // means we are in fallback platform
          $active.data('platform', platform.slug); // But if we click on it we want to keep our inital platform
        }
        // We skip and don't use fallback platform
        break;
      }
    }
    if (!$active.length) {
      $active = $preferred.length ? $preferred : $dropdownItems.eq(0);
    }

    // Update the active state of the dropdown items
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
    $block.find('[data-platform-switcher-target]').text($active.text());
  });

  history.replaceState({}, '', updateUrlPlatform(location.href, slug));

  $('.config-key').each(function() {
    if (!this.getAttribute('data-config-key')) {
      this.setAttribute('data-config-key', $(this).text().trim());
    }
  });

  $('.unsupported-hint').remove();
  $('.unsupported').each(function() {
    $('<div class="unsupported-hint"></div>').prependTo(this);
  });

  syncRelatedElements();
};

$(document).on('click', 'a[href^="?platform="]', function(event) {
  event.preventDefault();
  const { query } = qs.parseUrl(this.href);
  showPlatform(query.platform);
});

$(document).on('click', '[data-toggle="platform"]', function(event) {
  event.preventDefault();
  showPlatform($(event.target).data('platform'));
});

$(document).on('page.didUpdate', function(event) {
  if (!$('[data-platform-specific-content]').length) return;
  // Update the preferredPlatform based on the url.
  showPlatform(qs.parse(location.search).platform);
});
